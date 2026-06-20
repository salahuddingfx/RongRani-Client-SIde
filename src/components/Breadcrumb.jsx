import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Breadcrumb = ({ items = [] }) => {
  const { t } = useLanguage();

  const defaultItems = [{ label: t('home'), to: '/' }];
  const allItems = [...defaultItems, ...items];

  return (
    <nav aria-label="Breadcrumb" className="py-3 mb-2">
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const label = t(item.labelKey) || item.label;

          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
              )}
              {isLast ? (
                <span className="text-slate-800 dark:text-slate-200 font-medium">{label}</span>
              ) : (
                <Link
                  to={item.to}
                  className="text-slate-400 dark:text-slate-500 hover:text-maroon dark:hover:text-maroon transition-colors"
                >
                  {index === 0 ? (
                    <Home className="w-3.5 h-3.5" />
                  ) : (
                    label
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
