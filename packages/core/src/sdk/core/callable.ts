/**
 * Callable SDK Implementation
 * 
 * This module provides the implementation for the callable SDK pattern,
 * allowing the SDK to be both called as a function and accessed as an object.
 */
import { Express } from '../types';
import { Human1 } from './human1';

/**
 * Interface for the callable SDK object
 * This extends the Human1 class with a callable signature
 */
export interface CallableSDK extends Human1 {
  /**
   * Call the SDK as a function
   * 
   * @param appOrOptions Express app or options
   * @returns Result of initialization
   */
  (appOrOptions?: any): any;
}

/**
 * Create a callable wrapper around the Human1 instance
 * 
 * @param instance Human1 instance to make callable
 * @param initFn Function to call when the SDK is called as a function
 * @returns Callable SDK object
 */
export function makeCallable(instance: Human1, initFn: Function): CallableSDK {
  // Create a callable function
  const callableInstance = function(appOrOptions?: any): any {
    // When called as a function, delegate to the initializer function
    return initFn(appOrOptions);
  } as CallableSDK;
  
  // Debug output (can be removed in production)
  console.log('[SDK CALLABLE DEBUG] makeCallable: Creating callable wrapper');
  
  // Copy prototype methods from the original instance
  Object.setPrototypeOf(callableInstance, Object.getPrototypeOf(instance));
  console.log('[SDK CALLABLE DEBUG] makeCallable: Set prototype chain');
  
  // List methods for debugging
  console.log('[SDK CALLABLE DEBUG] makeCallable: Instance prototype methods:', 
    Object.getOwnPropertyNames(Object.getPrototypeOf(instance)));
  
  // Bind all methods to the original instance
  const protoMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
    .filter(name => name !== 'constructor' && typeof instance[name as keyof Human1] === 'function');
  
  for (const method of protoMethods) {
    console.log(`[SDK CALLABLE DEBUG] makeCallable: Creating method binding for ${method}`);
    // Bind each method to the original instance
    callableInstance[method as keyof CallableSDK] = 
      instance[method as keyof Human1].bind(instance) as any;
  }
  
  console.log('[SDK CALLABLE DEBUG] makeCallable: Processing property descriptors from prototype');
  
  // Transfer instance properties
  const instanceProps = Object.getOwnPropertyNames(instance)
    .filter(prop => prop !== 'constructor');
  
  console.log('[SDK CALLABLE DEBUG] makeCallable: Instance properties:', instanceProps);
  
  // Copy properties using property descriptors
  for (const prop of instanceProps) {
    const descriptor = Object.getOwnPropertyDescriptor(instance, prop);
    if (descriptor) {
      console.log(`[SDK CALLABLE DEBUG] makeCallable: Creating property accessor for ${prop}`);
      Object.defineProperty(callableInstance, prop, descriptor);
    }
  }
  
  console.log('[SDK CALLABLE DEBUG] makeCallable: Finished creating callable wrapper');
  
  return callableInstance;
} 