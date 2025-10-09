"use client";

import ResponsiveLayout from "@/components/ResponsiveLayout";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";

export default function TestDockPage() {
  return (
    <ResponsiveLayout activePage="test-dock">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dock Component Test</h1>
        <p className="mb-8">Testing the animated dock component functionality.</p>
        
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Interactive Dock Demo</h2>
          <p className="mb-6">Hover over the dock items at the bottom to see the magnification effect</p>
          
          <div className="flex justify-center">
            <Dock magnification={60} distance={100} className="bg-gray-700 border border-gray-600">
              <DockItem>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-600 text-white cursor-pointer">
                  <DockIcon>
                    <span className="text-2xl">🏠</span>
                  </DockIcon>
                  <span className="text-xs mt-1">Home</span>
                </div>
              </DockItem>
              <DockItem>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-600 text-white cursor-pointer">
                  <DockIcon>
                    <span className="text-2xl">📊</span>
                  </DockIcon>
                  <span className="text-xs mt-1">Dashboard</span>
                </div>
              </DockItem>
              <DockItem>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-600 text-white cursor-pointer">
                  <DockIcon>
                    <span className="text-2xl">🔔</span>
                  </DockIcon>
                  <span className="text-xs mt-1">Alerts</span>
                </div>
              </DockItem>
              <DockItem>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-600 text-white cursor-pointer">
                  <DockIcon>
                    <span className="text-2xl">⚙️</span>
                  </DockIcon>
                  <span className="text-xs mt-1">Settings</span>
                </div>
              </DockItem>
              <DockItem>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-600 text-white cursor-pointer">
                  <DockIcon>
                    <span className="text-2xl">❓</span>
                  </DockIcon>
                  <span className="text-xs mt-1">Help</span>
                </div>
              </DockItem>
            </Dock>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}