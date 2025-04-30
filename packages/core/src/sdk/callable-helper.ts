/**
 * SDK Callable Helper Module
 * 
 * This module provides the functionality to make a regular object callable
 * as a function while maintaining all of its properties and methods.
 * 
 * It's the core of the SDK's dual object/function interface, enabling the
 * pattern where users can both call sdk() and use sdk.method() syntax.
 */

/**
 * Debug logging helper for callable wrapper operations
 * 
 * Outputs debug information about the callable wrapper's operations
 * to help troubleshoot issues with method binding and property access.
 * 
 * @param message The debug message to output
 * @param args Optional arguments to include in the log
 */
// Debug helper
const debug = (message: string, ...args: any[]) => {
  console.log(`[SDK CALLABLE DEBUG] ${message}`, ...args);
};

/**
 * Makes a function that extends an object instance.
 * This allows an object to be callable like a function while maintaining its properties and methods.
 * 
 * The resulting object can be used in two ways:
 * 1. Called as a function: callable(...args)
 * 2. Used as an object with methods: callable.method()
 * 
 * The implementation carefully handles property descriptors, getters/setters,
 * and method bindings to ensure the callable wrapper behaves exactly like
 * the original object while adding the function calling capability.
 * 
 * @template T The type of the original object
 * @template R The return type of the callable function
 * @param instance The instance to extend
 * @param callable The callable function
 * @returns A combined callable object with instance properties
 */
export function makeCallable<T extends object, R>(
  instance: T, 
  callable: (...args: any[]) => R
): T & { (...args: any[]): R } {
  debug('makeCallable: Creating callable wrapper');
  
  // Cast to any to allow property assignment
  const callableObj = callable as any;
  
  // Set prototype chain
  Object.setPrototypeOf(callableObj, Object.getPrototypeOf(instance));
  debug('makeCallable: Set prototype chain');
  
  // Get instance methods from prototype
  const protoMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
  debug('makeCallable: Instance prototype methods:', protoMethods);
  
  // Copy instance methods
  protoMethods.forEach(key => {
    if (key !== 'constructor') {
      // Create method that calls the original method with the correct 'this' binding
      debug(`makeCallable: Creating method binding for ${key}`);
      callableObj[key] = function(...args: any[]) {
        debug(`makeCallable: Method ${key} called on callable wrapper, delegating to instance`);
        return (instance as any)[key].apply(instance, args);
      };
    }
  });
  
  // Handle getters and setters properly
  const instanceProto = Object.getPrototypeOf(instance);
  const propertyDescriptors = Object.getOwnPropertyDescriptors(instanceProto);
  debug('makeCallable: Processing property descriptors from prototype');
  
  // Apply getters and setters from the prototype
  for (const key in propertyDescriptors) {
    if (key !== 'constructor') {
      const descriptor = propertyDescriptors[key];
      if (descriptor.get || descriptor.set) {
        debug(`makeCallable: Setting up getter/setter for ${key}`);
        Object.defineProperty(callableObj, key, {
          get: descriptor.get 
            ? function() { 
                debug(`makeCallable: Getter for ${key} called`);
                return descriptor.get!.call(instance); 
              } 
            : undefined,
          set: descriptor.set 
            ? function(value) { 
                debug(`makeCallable: Setter for ${key} called with value:`, value);
                descriptor.set!.call(instance, value); 
              } 
            : undefined,
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable
        });
      }
    }
  }
  
  // Copy instance properties and make all methods call through to the instance
  const instanceProperties = Object.getOwnPropertyNames(instance);
  debug('makeCallable: Instance properties:', instanceProperties);
  
  instanceProperties.forEach(key => {
    // Add a special getter/setter for each property that accesses the original instance
    debug(`makeCallable: Creating property accessor for ${key}`);
    Object.defineProperty(callableObj, key, {
      get: function() { 
        debug(`makeCallable: Property ${key} accessed`);
        return (instance as any)[key]; 
      },
      set: function(value) { 
        debug(`makeCallable: Property ${key} set to:`, value);
        (instance as any)[key] = value; 
      },
      enumerable: true,
      configurable: true
    });
  });
  
  // Add a special method to directly access the underlying instance
  callableObj.__getInstance = function() {
    debug('makeCallable: __getInstance called');
    return instance;
  };
  
  debug('makeCallable: Finished creating callable wrapper');
  return callableObj as T & { (...args: any[]): R };
} 