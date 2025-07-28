
import * as React from "react";
import * as SidebarPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const SidebarProvider = ({ children, defaultOpen = false, open, onOpenChange, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const openState = open !== undefined ? open : isOpen;
  const setOpenState = onOpenChange !== undefined ? onOpenChange : setIsOpen;

  return (
    <div className="flex min-h-screen w-full" {...props}>
      <SidebarContext.Provider value={{ open: openState, setOpen: setOpenState }}>
        {children}
      </SidebarContext.Provider>
    </div>
  );
};

const SidebarContext = React.createContext({
  open: false,
  setOpen: () => {},
});

const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

const Sidebar = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open } = useSidebar();
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-64 flex-col border-r bg-background transition-all duration-300",
        !open && "w-0 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center border-b px-4 py-2", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto p-2", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-t p-2", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-4", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1 text-sm font-medium text-muted-foreground", className)}
    {...props}
  />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef(({ className, isActive, asChild, children, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button";
  
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarInset = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col", className)}
    {...props}
  />
));
SidebarInset.displayName = "SidebarInset";

const SidebarTrigger = React.forwardRef(({ className, ...props }, ref) => {
  const { open, setOpen } = useSidebar();
  
  return (
    <button
      ref={ref}
      onClick={() => setOpen(!open)}
      className={cn("p-2 rounded-md hover:bg-gray-100", className)}
      {...props}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarInset, 
  SidebarTrigger,
  useSidebar 
};
