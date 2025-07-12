import { BreadCrumb } from 'primereact/breadcrumb';
import React from 'react';
import { useLocation } from 'react-router-dom';
import type { BreadcrumbItem } from '../../types';

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const location = useLocation();

  // Auto-generate breadcrumbs from route if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/', isActive: false }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  const home = { icon: 'pi pi-home', url: '/' };

  const itemsTemplate = breadcrumbItems.map((item, index) => ({
    label: item.label,
    url: item.isActive ? undefined : item.path,
    className: item.isActive ? 'text-gray-500' : 'text-blue-600 hover:text-blue-800'
  }));

  return (
    <div className="mb-6">
      <BreadCrumb
        model={itemsTemplate}
        home={home}
        className="border-none bg-transparent p-0"
      />
    </div>
  );
};

export default Breadcrumb; 