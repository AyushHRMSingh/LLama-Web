import { AlertCircle, LayoutDashboard, MessageCircle, MoreVertical, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ChatList({ Statusa, Data, onDeleteChat }: any) {
  if (Statusa.status == 200 && Data.length == 0) {
    return (
      <div className="bg-background rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm p-10 text-center">
        <div className="inline-flex justify-center items-center rounded-full bg-gray-50 dark:bg-gray-800/50 p-6 mb-4">
          <MessageCircle className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Start a new chat to begin your conversation with AI
        </p>
      </div>
    );
  } else if (Statusa.status == 200 && Data.length > 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Conversations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Data.map((item: any) => (
            <div key={item.ChatId} className="relative group">
              <div className="bg-background border border-gray-100 dark:border-gray-800 rounded-lg p-5 
                            shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 
                            transition-all duration-300 h-full flex flex-col
                            transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <a href={'/chat/' + item.ChatId} className="flex items-center flex-1">
                    <div className="bg-primary/10 rounded-full p-2 mr-3 group-hover:bg-primary/20 transition-colors">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {item.Title}
                    </h3>
                  </a>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10 relative"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                        <span className="sr-only">More options</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDeleteChat(item.ChatId);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="mt-auto pt-3">
                  <span className="text-xs bg-gray-50 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 
                                px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700 
                                group-hover:border-gray-200 dark:group-hover:border-gray-600 transition-colors">
                    {item.Model}
                  </span>
                </div>
              </div>
              {/* <a 
                href={'/chat/' + item.ChatId} 
                className="absolute inset-0 z-0"
                aria-hidden="true"
              ></a> */}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-background rounded-lg border border-red-100 dark:border-red-900/30 shadow-sm p-6 text-center">
        <div className="inline-flex justify-center items-center rounded-full bg-red-50 dark:bg-red-900/20 p-3 mb-3">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-1">Connection Error</h3>
        <p className="text-red-500 dark:text-red-400">Resource Server Not Found or Inaccessible</p>
      </div>
    );
  }
}