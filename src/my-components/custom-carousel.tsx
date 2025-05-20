import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
  
  type ImageItem = {
    src: string;
    alt?: string;
    captionTitle?: string;
    captionText?: string;
  };
  
  export function CustomCarousel({ images }: { images: ImageItem[] }) {
    const baseImageUrl = import.meta.env.VITE_SERVER_URL;
  
    if (!images || images.length === 0) return <p>No images available</p>;
  
    return (
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="flex flex-col items-center">
              <img
                src={`${baseImageUrl}/${image.src}`}
                alt={image.alt || `Slide ${index + 1}`}
                className="max-h-[400px] object-contain rounded-xl"
              />
              {(image.captionTitle || image.captionText) && (
                <div className="text-center mt-2">
                  {image.captionTitle && <h5 className="text-lg font-bold">{image.captionTitle}</h5>}
                  {image.captionText && <p className="text-sm text-muted-foreground">{image.captionText}</p>}
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  }
  