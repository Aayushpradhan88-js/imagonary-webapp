"use client"

import React, { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import {
  MenuIcon,
  LayoutDashboardIcon,
  UploadIcon,
  ImageIcon,
  // Code,
  Share2Icon,
  LogOutIcon,
  HelpCircleIcon,
  SettingsIcon,
} from "lucide-react";

import { Provider } from '../providers';
import ThemeSwitcher from '@/components/ThemeSwitch';

//--------SIDEBAR LINKS---------//
const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" }
];


export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsPopupOpen, setSettingsPopupOpen] = useState(false);

  const settingsButtonRef = useRef<HTMLLIElement>(null);
  const settingPopupRef = useRef<HTMLDivElement>(null);

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

  //-----CLOSE POP-UP WHEN CLICKING OUTSIDE-----//
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingPopupRef.current && !settingPopupRef.current.contains(event.target as Node)
        && settingsButtonRef.current && !settingsButtonRef.current.contains(event.target as Node)) {
        setSettingsPopupOpen(false);
      };
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  //-----FUNCTION TO toggleSETTINGS POP-UP VISIBILITY-----//
  const toggleSettingsPopup = () => {
    setSettingsPopupOpen(!settingsPopupOpen)
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <div className="flex h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <aside className="hidden lg:flex flex-col bg-gray-200 dark:bg-gray-800 w-64 h-full border-r border-gray-300 dark:border-gray-700 p-4">

              {/* //-----LOGO-----// */}
              <div className="flex items-center justify-center py-4 mb-4">
                <ImageIcon className="w-10 h-10 text-blue-500 dark:text-blue-400" />
              </div>

              {/* //-----SIDE-BAR-----// */}
              <ul className="menu p-0 w-full text-base-content flex-grow">
                {sidebarItems.map((item) => (
                  <li key={item.href} className="mb-2">
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-medium
                    ${pathname === item.href
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      <item.icon className="w-6 h-6" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}

                <li className="mb-2">

                </li>
              </ul>

              {/* //-----SETTINGS with Theme Toggle Pop-up (Desktop)-----// */}
              <li ref={settingsButtonRef} className="mb-2 relative">
                <button
                  onClick={toggleSettingsPopup}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-medium w-full text-left
                     ${settingsPopupOpen
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  <SettingsIcon className="w-6 h-6" />
                  <span>Settings</span>
                </button>

                {settingsPopupOpen && (
                  <div
                    ref={settingPopupRef}
                    className="absolute bottom-full mb-2 left-0 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg dark:shadow-md py-2 w-full z-10"
                  >
                    <ul>
                      <li>
                        <ThemeSwitcher />
                      </li>
                    </ul>
                  </div>
                )}
              </li>

              {/* //-----SIGN OUT-----// */}
              {user && (
                <div className="p-4 mt-auto">
                  <button
                    onClick={handleSignOut}
                    className="p-2 flex items-center justify-center btn btn-error cursor-pointer w-full rounded-lg text-white bg-red-600 hover:bg-red-700 border-none"
                  >
                    <LogOutIcon className="mr-2 h-5 w-5" />
                    Sign Out
                  </button>
                  
                </div>
              )}
            </aside>

            <div className="flex flex-col flex-grow overflow-hidden">
              <header className="w-full bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 py-4 px-6 lg:px-8">
                <div className="flex justify-between items-center max-w-full mx-auto">
                  <div className="lg:hidden flex-none">
                    <label
                      htmlFor="sidebar-drawer-mobile"
                      className="btn btn-square btn-ghost"
                      onClick={() => setSidebarOpen(true)}
                    >
                      <MenuIcon className="text-gray-800 dark:text-gray-200" />
                    </label>
                  </div>

                  {/* //-----LOGO-----// */}
                  <div className="flex-1">
                    <Link href="/" onClick={handleLogoClick}>
                      <div className="text-2xl font-bold tracking-tight cursor-pointer text-gray-800 dark:text-gray-100 ml-4 lg:ml-0">
                        Your Uploads
                      </div>
                    </Link>
                  </div>

                  {/* //-----USER INFO-----// */}
                  <div className="flex items-center space-x-4">
                    {user && (
                      <>
                        <div className="rounded-lg avatar">
                          <div className="w-8 h-8 rounded-full">
                            <img
                              src={user.imageUrl}
                              alt={user.username || user.emailAddresses[0].emailAddress}
                            />
                          </div>
                        </div>
                        <span className="text-sm truncate max-w-xs  lg:max-w-md text-gray-800 dark:text-gray-200">
                          {user.username || user.emailAddresses[0].emailAddress}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </header>

              <main className="flex-grow space-y-4 p-4 rounded-lg overflow-x-auto bg-white dark:bg-gray-900">
                <div className="">
                  {children}
                </div>
              </main>
            </div>

            {/* //---Mobile----// */}
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

                  {/* //-----SIDEBAR-----// */}
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

                    {/* Mobile Settings - integrate ThemeSwitcher here as well */}
                    <li className="mb-2">
                      <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-medium w-full text-left
                                      hover:bg-gray-700 text-gray-300">
                        <SettingsIcon className="w-6 h-6" />
                        <span>Settings</span> {/* You might want to make this a popup like desktop */}
                      </div>
                      {/* Directly include ThemeSwitcher for mobile if no popup */}
                      <div className="ml-8 mt-2">
                        <ThemeSwitcher />
                      </div>
                    </li>


                    {/* //-----HELP-----// */}
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
                        className="btn btn-error bg-red-800 w-full rounded-lg text-whit border-none"
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
        </Provider>
      </body>
    </html>
  );
}