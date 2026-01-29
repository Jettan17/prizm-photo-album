import { getPhotos } from "@/lib/photos";
import { StickyHeader } from "@/components/StickyHeader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Footer } from "@/components/Footer";

export default function Home() {
  const photos = getPhotos();

  return (
    <main className="container mx-auto px-4">
      <StickyHeader
        title="Prizm"
        author="Jethro Tan"
        handle="@jepho_tan"
      />
      <div className="mt-4">
        <PhotoGallery photos={photos} />
      </div>
      <Footer />
    </main>
  );
}
