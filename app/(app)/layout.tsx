"use client"

import React, { useState } from 'react'
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import {
  MenuIcon,
  LayoutDashboardIcon,
  UploadIcon,
  ImageIcon,
  HelpCircleIcon,
  LogOutIcon,
  Share2Icon,
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" }
]

export default function AppLayout({ children }:
  Readonly<{ children: React.ReactNode }>) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogoClick = () => {
    router.push("/");
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <aside className="hidden lg:flex flex-col bg-gray-800 w-64 h-full border-r border-gray-700 p-4">
        <div className="flex items-center justify-center py-4 mb-4">
          <ImageIcon className="w-10 h-10 text-blue-400" />
        </div>
        <ul className="menu p-0 w-full text-base-content flex-grow">
          {sidebarItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-medium
                  ${pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                  }`}
              >
                <item.icon className="w-6 h-6" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="mt-auto">
            <Link
              href="/help"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-medium
                ${pathname === "/help"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
                }`}
            >
              <HelpCircleIcon className="w-6 h-6" />
              <span>Help</span>
            </Link>
          </li>
        </ul>
        {user && (
          <div className="p-4 mt-auto">
            <button
              onClick={handleSignOut}
              className="btn btn-error w-full text-white bg-red-600 hover:bg-red-700 border-none"
            >
              <LogOutIcon className="mr-2 h-5 w-5" />
              Sign Out
            </button>
          </div>
        )}
      </aside>

      <div className="flex flex-col flex-grow overflow-hidden">
        <header className="w-full bg-gray-800 border-b border-gray-700 py-4 px-6 lg:px-8">
          <div className="flex justify-between items-center max-w-full mx-auto">
            <div className="lg:hidden flex-none">
              <label
                htmlFor="sidebar-drawer-mobile"
                className="btn btn-square btn-ghost"
                onClick={() => setSidebarOpen(true)}
              >
                <MenuIcon />
              </label>
            </div>
            <div className="flex-1">
              <Link href="/" onClick={handleLogoClick}>
                <div className="text-2xl font-bold tracking-tight cursor-pointer text-gray-100 ml-4 lg:ml-0">
                  Your Uploads
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <img
                        src={user.imageUrl}
                        alt={user.username || user.emailAddresses[0].emailAddress}
                      />
                    </div>
                  </div>
                  <span className="text-sm truncate max-w-xs lg:max-w-md">
                    {user.username || user.emailAddresses[0].emailAddress}
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-grow space-y-4 p-4 rounded-lg overflow-x-auto ">
         
          <div className="">
            {children} {/* This is where your individual VideoCard components (or equivalent) will be rendered */}
          </div>
        </main>
      </div>

      <div className="drawer-end lg:hidden z-50 absolute inset-0">
        <input 
        id="sidebar-drawer-mobile"
         type="checkbox" 
         className="drawer-toggle" 
         checked={sidebarOpen} 
         onChange={() => setSidebarOpen(!sidebarOpen)} 
         />
        <div className="drawer-side">
          <label htmlFor="sidebar-drawer-mobile" aria-label="close sidebar" className="drawer-overlay" onClick={() => setSidebarOpen(false)}></label>
          <aside className="bg-gray-800 w-64 min-h-full flex flex-col p-4">
            <div className="flex items-center justify-center py-4 mb-4">
              <ImageIcon className="w-10 h-10 text-blue-400" />
            </div>
            <ul className="menu p-0 w-full text-base-content flex-grow">
              {sidebarItems.map((item) => (
                <li key={item.href} className="mb-2">
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-medium
                      ${pathname === item.href
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-700 text-gray-300"
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-6 h-6" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li className="mt-auto">
                <Link
                  href="/help"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-medium
                    ${pathname === "/help"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <HelpCircleIcon className="w-6 h-6" />
                  <span>Help</span>
                </Link>
              </li>
            </ul>
            {user && (
              <div className="p-4 mt-auto">
                <button
                  onClick={handleSignOut}
                  className="btn btn-error w-full text-white bg-red-600 hover:bg-red-700 border-none"
                >
                  <LogOutIcon className="mr-2 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
};