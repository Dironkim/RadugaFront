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

const baseImageUrl = import.meta.env.VITE_SERVER_URL as string;

export function CustomCarousel({ images }: { images: ImageItem[] }) {
  if (!images || images.length === 0) {
    return <p className="text-center text-gray-500">Нет изображений</p>;
  }

  return (
    <div className="w-full h-[520px] rounded-xl relative bg-black/5 flex items-center justify-center">
      <Carousel className="w-full relative">
        <CarouselContent className="!ml-0">
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className="p-0 m-0 flex items-center justify-center"
            >
              <img
                src={`${baseImageUrl}/${image.src}`}
                alt={image.alt || `Изображение ${index + 1}`}
                className="max-h-[480px] max-w-[calc(100%-40px)] object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2
            !bg-transparent hover:!bg-black/60
            transition-colors duration-200 !text-white
            [&>svg]:drop-shadow-[0_0_1.5px_black]
            rounded-full p-2"
        />
        <CarouselNext
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2
            !bg-transparent hover:!bg-black/60
            transition-colors duration-200 !text-white
            [&>svg]:drop-shadow-[0_0_1.5px_black]
            rounded-full p-2"
        />
      </Carousel>
    </div>
  );
}
