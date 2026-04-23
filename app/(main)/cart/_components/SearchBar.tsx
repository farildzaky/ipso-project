"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import RefreshIcon from "../../../../assets/admin/admin_refresh.svg";
import SearchIcon from "../../../../assets/admin/admin_search.svg";

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedSort: string;
    onSortChange: (value: string) => void;
    onRefresh: () => void;
}

export default function SearchBar({
    searchTerm,
    onSearchChange,
    selectedSort,
    onSortChange,
    onRefresh
}: SearchBarProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const sortOptions = ["Relevant", "Newest", "Lowest Price"];

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
                onClick={onRefresh}
                className="flex items-center justify-center p-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition w-12 h-12 shrink-0"
            >
                <Image src={RefreshIcon} alt="Refresh" className="w-5 h-5 opacity-70" />
            </button>

            <div className="relative flex-1">
                <Image
                    src={SearchIcon}
                    alt="Search"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50"
                />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Cari sesuatu disini ..."
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 h-12 outline-none focus:border-[#1a3a5c] focus:ring-1 focus:ring-[#1a3a5c]"
                />
            </div>

            <div className="relative shrink-0" ref={dropdownRef}>
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center justify-between border border-gray-300 rounded-xl px-4 h-12 bg-white text-gray-700 hover:bg-gray-50 outline-none focus:border-[#1a3a5c] focus:ring-1 focus:ring-[#1a3a5c] w-full sm:w-40 cursor-pointer transition-colors"
                >
                    <span className="text-sm">{selectedSort}</span>
                    <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                        {sortOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onSortChange(option);
                                    setOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedSort === option
                                    ? "bg-gray-50 text-[#1a3a5c] font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}