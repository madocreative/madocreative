'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';

export interface ProductCardProduct {
    _id: string;
    name: string;
    slug: string;
    price: number;
    category: string;
    images: string[];
    inStock: boolean;
}

function formatRwf(amount: number): string {
    return `RWF ${amount.toLocaleString('en-RW', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function ProductCard({
    product,
    variant = 'catalog',
}: {
    product: ProductCardProduct;
    variant?: 'catalog' | 'related';
}) {
    const fallbackImage = 'https://placehold.co/400x400/111109/ffc000?text=No+Image';
    const touchStartX = useRef<number | null>(null);
    const images = useMemo(() => {
        const cleaned = (product.images || []).map((image) => image?.trim()).filter(Boolean) as string[];
        return cleaned.length > 0 ? cleaned : [fallbackImage];
    }, [product.images]);
    const [activeImage, setActiveImage] = useState(0);
    const canSlide = images.length > 1;
    const href = `/shop/${product.slug}`;
    const isCatalog = variant === 'catalog';

    const goToImage = (index: number) => {
        setActiveImage((index + images.length) % images.length);
    };

    const handlePrev = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        goToImage(activeImage - 1);
    };

    const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        goToImage(activeImage + 1);
    };

    const handleDotClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        event.preventDefault();
        event.stopPropagation();
        goToImage(index);
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!canSlide || touchStartX.current === null) return;
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const deltaX = touchEndX - touchStartX.current;
        touchStartX.current = null;

        if (Math.abs(deltaX) < 40) return;
        goToImage(deltaX < 0 ? activeImage + 1 : activeImage - 1);
    };

    return (
        <div className={`group flex h-full flex-col bg-[#0a0a08] ${isCatalog ? '' : 'hover:bg-[#0d0d0b] transition-colors'}`}>
            <div
                className="relative aspect-square overflow-hidden bg-[#111109]"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <Link href={href} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />

                {images.map((image, index) => (
                    <img
                        key={`${image}-${index}`}
                        src={image}
                        alt={index === activeImage ? product.name : ''}
                        className={`absolute inset-0 w-full h-full object-contain p-2 transition-all duration-300 ease-out ${
                            index === activeImage
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-[1.03] pointer-events-none'
                        }`}
                    />
                ))}

                {canSlide && (
                    <>
                        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity duration-200">
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-sm transition-all hover:border-[#ffc000] hover:bg-[#ffc000] hover:text-[#0a0a08]"
                                aria-label={`Previous image for ${product.name}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-sm transition-all hover:border-[#ffc000] hover:bg-[#ffc000] hover:text-[#0a0a08]"
                                aria-label={`Next image for ${product.name}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>

                        <div className="absolute left-2 top-2 z-20 rounded-full border border-white/10 bg-black/55 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">
                            {activeImage + 1}/{images.length}
                        </div>

                        <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-2 py-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity duration-200">
                            {images.map((_, index) => (
                                <button
                                    key={`${product._id}-dot-${index}`}
                                    type="button"
                                    onClick={(event) => handleDotClick(event, index)}
                                    className={`pointer-events-auto rounded-full transition-all duration-200 ${
                                        index === activeImage
                                            ? 'h-1.5 w-5 bg-[#ffc000]'
                                            : 'h-1.5 w-1.5 bg-white/45 hover:bg-white/75'
                                    }`}
                                    aria-label={`Show image ${index + 1} for ${product.name}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {!product.inStock && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0a08]/70">
                        <span className="border border-white/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                            Out of Stock
                        </span>
                    </div>
                )}

                {product.inStock && (
                    <div className="absolute right-2 top-2 z-20 h-2 w-2 rounded-full bg-[var(--gold)]" title="In Stock" />
                )}
            </div>

            <Link
                href={href}
                className={isCatalog
                    ? 'flex flex-1 flex-col gap-1.5 border-t border-white/5 bg-[#0d0d0b] px-3 py-2.5'
                    : 'border-t border-white/5 px-3 py-3'
                }
            >
                {isCatalog && (
                    <p className="text-[#ffc000] text-[9px] font-bold uppercase tracking-widest">{product.category}</p>
                )}
                <h3 className={`text-white text-xs font-bold leading-snug line-clamp-2 group-hover:text-[#ffc000] transition-colors ${isCatalog ? '' : 'mb-1'}`}>
                    {product.name}
                </h3>
                <div className={`mt-auto flex items-center justify-between ${isCatalog ? 'pt-1' : ''}`}>
                    <span className="text-[#ffc000] font-bold text-sm">{formatRwf(product.price)}</span>
                    {isCatalog && (
                        <span className="material-symbols-outlined text-slate-600 text-[14px] group-hover:text-[#ffc000] transition-colors">chevron_right</span>
                    )}
                </div>
            </Link>
        </div>
    );
}
