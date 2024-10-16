"use client";
import { addRoomSchema, AddRoomSchemaType, UpdateRoomSchemaType } from "@/types/room";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { addRoomFormElements } from "@/config";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MediaUploader } from "@/components/MediaUploader";
import { addRoom, updateRoom, uploadImage } from "@/app/actions/room.action";
import { toast } from "sonner";
import { Router, useRouter } from "next/router";

interface IRoom {
     id: string;
     name: string;
     image: string;
     price: number;
     lengthInFeet: number;
     widthInFeet: number;
     address: string;
     city: string;
     state: string;
     pin: number;
     description: string | null;
     ownerId: string | null;
}

interface RoomFormProps {
     room?: IRoom;
     roomId?: string;
}

export function RoomForm({ room, roomId }: RoomFormProps) {
     const router = useRouter();
     const [image, setImage] = useState<any>(room?.image || null);
     const publicId = room?.image;

     const initialValue = {
          name: room?.name || "",
          image: room?.image || "",
          price: room?.price || 0,
          lengthInFeet: room?.lengthInFeet || 0,
          widthInFeet: room?.widthInFeet || 0,
          address: room?.address || "",
          city: room?.city || "",
          state: room?.state || "",
          pin: room?.pin || 0,
          description: room?.description || "",
     }

     const form = useForm<AddRoomSchemaType>({
          resolver: zodResolver(addRoomSchema),
          defaultValues: initialValue,
     });

     async function addRoomHandler(data: AddRoomSchemaType) {
          try {
               if (image && !roomId) {
                    const uploadedImage = await uploadImage(image);
                    if (uploadedImage.publicId) {
                         const response = await addRoom({ ...data, image: uploadedImage.publicId });
                         if (response.success) {
                              toast.success("Room added successfully");
                              router.push("/");
                         } else {
                              console.error(response);
                              toast.error("Error while adding room");
                         }
                    } else {
                         console.error(uploadedImage);
                         toast.error("Error while uploading image");
                    }
               } else if (roomId) {
                    const response = await updateRoom({ ...data }, roomId);
                    if (response.success) {
                         toast.success("Room updated successfully");
                         router.push("/");
                    } else {
                         console.error(response);
                         toast.error("Error while updating room");
                    }
               }
          } catch (error) {
               console.error(error);
               toast.error("Internal server error");
          }
     }

     return (
          <div className="flex-center">
          <Form {...form}>
               <form onSubmit={form.handleSubmit(addRoomHandler)} className="space-y-4 w-3/5 border-2 border-purple-2 rounded-md shadow-md p-6">
                    <div className="flex-center border border-purple-2 p-4">
                         <MediaUploader image={image} setImage={setImage} publicId={publicId} />
                    </div>
                    {addRoomFormElements.map((formElement) => (
                         <FormField
                              key={formElement.name}
                              control={form.control}
                              name={formElement.name as keyof AddRoomSchemaType}
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel className="form-label">{formElement.label}</FormLabel>
                                        <FormControl>
                                             <>
                                                  {formElement.componentType === "input" && (
                                                       <Input 
                                                            {...field}
                                                            type={formElement.type}
                                                            placeholder={formElement.placeholder}
                                                       />
                                                  )}
                                                  {formElement.componentType === "textarea" && (
                                                       <Textarea
                                                            {...field}
                                                            placeholder={formElement.placeholder}
                                                       />
                                                  )}
                                             </>
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         />
                    ))}
                    <Button
                         type="submit"
                         disabled={form.formState.isSubmitting}
                         className="w-full bg-purple-1 hover:bg-purple-3"
                    >
                         {form.formState.isSubmitting ? "Please wait..." : "Submit"}
                    </Button>
               </form>
          </Form>
          </div>
     )
}