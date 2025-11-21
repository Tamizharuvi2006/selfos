import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera, Calendar, Tag } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import filesData from '@/mock-data/files.json';
const photos = filesData.filter(file => file.type === 'image');
const PhotoManager: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const handleNext = () => {
    if (selectedImage === null) return;
    setSelectedImage((selectedImage + 1) % photos.length);
  };
  const handlePrev = () => {
    if (selectedImage === null) return;
    setSelectedImage((selectedImage - 1 + photos.length) % photos.length);
  };
  const currentPhoto = selectedImage !== null ? photos[selectedImage] : null;
  return (
    <div className="flex h-full bg-card text-card-foreground">
      <ScrollArea className="flex-1 p-4">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="mb-4 break-inside-avoid cursor-pointer"
              onClick={() => setSelectedImage(index)}
              whileHover={{ scale: 1.03 }}
              layoutId={`photo-${photo.id}`}
            >
              <img src={photo.url} alt={photo.name} className="w-full h-auto rounded-lg shadow-md" />
            </motion.div>
          ))}
        </div>
      </ScrollArea>
      <AnimatePresence>
        {selectedImage !== null && currentPhoto && (
          <Dialog open={true} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-6xl h-[90vh] p-0 bg-black/80 backdrop-blur-lg border-none flex flex-col md:flex-row">
              <div className="relative flex-1 flex items-center justify-center p-4">
                <motion.img
                  src={currentPhoto.url}
                  alt={currentPhoto.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  layoutId={`photo-${currentPhoto.id}`}
                />
                <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="w-full md:w-80 bg-card/80 p-4 flex flex-col text-card-foreground overflow-y-auto">
                <h3 className="text-lg font-bold mb-2 break-words">{currentPhoto.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{currentPhoto.size}</p>
                {currentPhoto.exif && (
                  <>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-muted-foreground" />
                        <span>{currentPhoto.exif.camera}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(currentPhoto.exif.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground mt-1" />
                        <div className="flex flex-wrap gap-2">
                          {currentPhoto.exif.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PhotoManager;