import { getPhotos } from "@/lib/photos";
import { StickyHeader } from "@/components/StickyHeader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Footer } from "@/components/Footer";

export default function Home() {
  const photos = getPhotos();

  return (
    <>
      <StickyHeader
        title="Prizm"
        author="Jethro Tan"
        handle="@jepho_tan"
      />
      <main className="container mx-auto px-4">
        <div className="mt-4">
          <PhotoGallery photos={photos} />
        </div>
      </main>
      <Footer />
    </>
  );
}
