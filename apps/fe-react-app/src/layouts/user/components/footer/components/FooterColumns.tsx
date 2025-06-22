// src/components/Footer/FooterColumns.tsx
import React from "react";
import type { FooterContactColumn, FooterLinkColumn } from "../../../type/userLayout.ts";

export type FooterColumnData = FooterLinkColumn | FooterContactColumn;

interface FooterColumnsProps {
  columns: FooterColumnData[];
}

const FooterColumns: React.FC<FooterColumnsProps> = ({ columns }) => {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 mb-2">
      {columns.map((column) => (
        <div key={column.title}>
          <h3 className="text-red-500 font-bold text-lg mb-4">{column.title}</h3>
          {/* Kiểm tra loại cột để render cho đúng */}
          {column.type === "links" ? (
            <ul className="space-y-1">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-black hover:text-red-500 transition duration-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-black space-y-3">
              <p className="flex items-start">
                <i className="fas fa-map-marker-alt w-5 mr-2 mt-1 text-red-500"></i>
                <span>{column.address}</span>
              </p>
              <p className="flex items-center">
                <i className="fas fa-phone-alt w-5 mr-2 text-red-500"></i>
                <span>{column.phone}</span>
              </p>
              <p className="flex items-center">
                <i className="fas fa-envelope w-5 mr-2 text-red-500"></i>
                <span>{column.email}</span>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FooterColumns;
