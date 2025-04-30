/**
 * @human1-sdk/ui
 * 
 * UI components for the Human1 SDK - natural language database queries
 */

// Default component exports
export { FileDropZone } from './components/tailwind3-static/elements/FileDropZone/FileDropZone';
export { Button } from './components/tailwind3-static/elements/Button';
export { ErrorDisplay } from './components/tailwind3-static/elements/Display/ErrorDisplay';
export { ParagraphView } from './components/tailwind3-static/elements/Display/ParagraphView';
export { TableView } from './components/tailwind3-static/elements/Display/TableView';
export { QueryInput } from './components/tailwind3-static/query/Input';
export { QueryResponseDisplay } from './components/tailwind3-static/query/Response';
export { Header } from './components/tailwind3-static/layout/Header';
export { Footer } from './components/tailwind3-static/layout/Footer';
export { Container } from './components/tailwind3-static/layout/Container';
export { QueryDemoSection } from './components/tailwind3-static/query/Demo/Section';
export { QueryDemoCard } from './components/tailwind3-static/query/Demo/Card';
export { QueryDemoPage } from './components/tailwind3-static/query/Demo/Page';
export { Tooltip } from './components/tailwind3-static/feedback/Tooltip';
export { HealthIndicator } from './components/tailwind3-static/feedback/HealthIndicator';
export { ExampleQueries } from './components';
export { QueryHistory } from './components';
export { QuerySection } from './components';

// TW3 prefixed exports for compatibility - now just aliases to the same components
export { Button as TW3Button } from './components/tailwind3-static/elements/Button';
export { ErrorDisplay as TW3ErrorDisplay } from './components/tailwind3-static/elements/Display/ErrorDisplay';
export { ParagraphView as TW3ParagraphView } from './components/tailwind3-static/elements/Display/ParagraphView';
export { TableView as TW3TableView } from './components/tailwind3-static/elements/Display/TableView';
export { QueryInput as TW3QueryInput } from './components/tailwind3-static/query/Input';
export { QueryResponseDisplay as TW3QueryResponseDisplay } from './components/tailwind3-static/query/Response';
export { Header as TW3Header } from './components/tailwind3-static/layout/Header';
export { Footer as TW3Footer } from './components/tailwind3-static/layout/Footer';
export { QueryDemoSection as TW3QueryDemoSection } from './components/tailwind3-static/query/Demo/Section';
export { QueryDemoCard as TW3QueryDemoCard } from './components/tailwind3-static/query/Demo/Card';
export { QueryDemoPage as TW3QueryDemoPage } from './components/tailwind3-static/query/Demo/Page';
export { Tooltip as TW3Tooltip } from './components/tailwind3-static/feedback/Tooltip';
export { HealthIndicator as TW3HealthIndicator } from './components/tailwind3-static/feedback/HealthIndicator';

// Export CSS Components with css prefix
export { ErrorDisplay as CSSErrorDisplay } from './components/css/ErrorDisplay';
export { TableView as CSSTableView } from './components/css/TableView';
export { ParagraphView as CSSParagraphView } from './components/css/ParagraphView';
export { QueryInput as CSSQueryInput } from './components/css/QueryInput';
export { QueryResponseDisplay as CSSQueryResponseDisplay } from './components/css/QueryResponseDisplay';
export { ExampleQueries as CSSExampleQueries } from './components/css/ExampleQueries';
export { QueryHistory as CSSQueryHistory } from './components/css/QueryHistory';
export { QuerySection as CSSQuerySection } from './components/css/QuerySection';

// Also export with New prefix for transition period
export { QueryDemoCard as NewQueryDemoCard } from './components/tailwind3-static/query/Demo/Card';
export { QueryDemoSection as NewQueryDemoSection } from './components/tailwind3-static/query/Demo/Section';
export { QueryDemoPage as NewQueryDemoPage } from './components/tailwind3-static/query/Demo/Page';

// Export hooks
export { useNaturalLanguageQuery } from './hooks/useNaturalLanguageQuery';

// Export utilities
export { formatQueryResponse } from './utils/formatters';

// Export services
export { checkHealth, startHealthMonitoring, CHECK_INTERVAL } from './services/healthCheck';
export type { HealthStatus } from './services/healthCheck';

// Export types
export * from './types';

// Export types from types directory
export type {
  QueryInputProps,
  QueryResponseDisplayProps,
  TableViewProps,
  ParagraphViewProps,
  ErrorDisplayProps,
  BaseProps,
  TableData,
  ParagraphData,
  ErrorData,
  ResponseData
} from './types';

// Export component-specific types
export type { ButtonProps } from './components/tailwind3-static/elements/Button/Button';
export type { HeaderProps } from './components/tailwind3-static/layout/Header/Header';
export type { FooterProps } from './components/tailwind3-static/layout/Footer/Footer';
export type { ContainerProps } from './components/tailwind3-static/layout/Container/Container';
export type { QueryDemoSectionProps } from './components/tailwind3-static/query/Demo/Section/QueryDemoSection';
export type { QueryDemoCardProps } from './components/tailwind3-static/query/Demo/Card/QueryDemoCard';
export type { QueryDemoPageProps } from './components/tailwind3-static/query/Demo/Page/QueryDemoPage'; 
export type { TooltipProps } from './components/tailwind3-static/feedback/Tooltip';
export type { HealthIndicatorProps } from './components/tailwind3-static/feedback/HealthIndicator';
export type { FileDropZoneProps, FileUpload } from './types/fileDropZone'; 