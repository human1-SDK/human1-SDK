import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load components
const SectionExample = React.lazy(() => import('../examples/section'));
const PageExample = React.lazy(() => import('../examples/page'));
const HierarchyExample = React.lazy(() => import('../examples/hierarchy'));
const HierarchyExplanation = React.lazy(() => import('../explanation/hierarchy'));
const CSSExample = React.lazy(() => import('../examples/css'));

export const AppRoutes = () => (
  <Routes>
    <Route path="/section" element={
      <Suspense fallback={<div>Loading...</div>}>
        <SectionExample />
      </Suspense>
    } />
    <Route path="/page" element={
      <Suspense fallback={<div>Loading...</div>}>
        <PageExample />
      </Suspense>
    } />
    <Route path="/hierarchy" element={
      <Suspense fallback={<div>Loading...</div>}>
        <HierarchyExample />
      </Suspense>
    } />
    <Route path="/explanation/hierarchy" element={
      <Suspense fallback={<div>Loading...</div>}>
        <HierarchyExplanation />
      </Suspense>
    } />
    <Route path="/css" element={
      <Suspense fallback={<div>Loading...</div>}>
        <CSSExample />
      </Suspense>
    } />
    
    {/* Default redirect */}
    <Route path="/" element={<Navigate to="/page" replace />} />
    <Route path="*" element={<Navigate to="/page" replace />} />
  </Routes>
); 