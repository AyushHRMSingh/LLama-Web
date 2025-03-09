import { FormEvent } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form } from "react-hook-form";
import { MessageCirclePlus } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createChat } from "@/functions/createChat";

export function AddChatDialog({modelList, serverDetails}: any) {
  
  console.log("modellist");
  console.log(modelList);
  return(
    <div>
      <Dialog>
        <DialogTrigger>
          <Button
          className="mr-3"
          onClick={()=>{
            console.log("clicked");
          }}>
            Add Chat
            <MessageCirclePlus className="ml-1" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Chat
            </DialogTitle>
            <DialogDescription>
              Select a model from the list and create a new chat
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={ async (event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              console.log(formData.get("model"));
              const response = await createChat(serverDetails.addr, serverDetails.token, formData.get("model") as string);
              console.log(response);
            }}
          >
            <Label htmlFor="model">Model</Label>
            <Select name="model">
              <SelectTrigger>
                <SelectValue placeholder="Select model"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {modelList.map((item: any) => (
                    <SelectItem key={item.Name} value={item.Name}>
                      {item.Name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button type="submit" className="mt-3">
              Create Chat
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}