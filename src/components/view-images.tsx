import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel';

type ImageT = {
  image: string;
  id: string;
  event_management_id: string;
};
type PropsT = {
  open: boolean;
  onClose: () => void;
  images: ImageT[];
};
export const ViewImages = ({ open, onClose, images }: PropsT) => {
  const baseUrl = 'https://bids.masstech.in/public';
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="aspect-video w-full min-w-[60%]">
        <DialogHeader>
          <DialogTitle>View Images</DialogTitle>
        </DialogHeader>
        <div className="flex h-full w-full items-center justify-center">
          <Carousel className="aspect-video w-[93%]">
            <CarouselContent>
              {images &&
                images.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={`${baseUrl}/${image.image}`} //${image.image}
                      alt="image not found"
                      className="w-full object-cover"
                      loading="lazy"
                    />
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};
