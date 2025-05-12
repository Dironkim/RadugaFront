import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const baseImageUrl = import.meta.env.VITE_SERVER_URL as string;

type ImageCarouselProps = {
  images: string[];
};

export function ImageCarousel({ images }: ImageCarouselProps) {
  if (!images || images.length === 0) {
    return <p className="text-center text-gray-500">Нет изображений</p>;
  }

  return (
    <div className="w-full h-[200px] overflow-hidden rounded-t-xl relative">
      <Carousel className="w-full h-full relative ">
        <CarouselContent className="h-full !ml-0">
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className="relative h-[200px] w-full p-0 m-0"
            >
              <img
                src={`${baseImageUrl}/${image}`}
                alt={`Изображение ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover object-center"
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
