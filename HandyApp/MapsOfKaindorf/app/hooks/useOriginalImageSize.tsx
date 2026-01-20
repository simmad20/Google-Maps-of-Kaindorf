import { Image } from 'react-native';
import {useEffect, useState} from "react";

export function useOriginalImageSize(source: any) {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!source) return;

        // LOCAL ASSET (require)
        if (typeof source === 'number') {
            const resolved = Image.resolveAssetSource(source);

            if (resolved?.width && resolved?.height) {
                setSize({
                    width: resolved.width,
                    height: resolved.height,
                });
            }
            return;
        }

        // REMOTE IMAGE
        Image.getSize(
            source.uri,
            (width, height) => setSize({ width, height }),
            () => console.warn('Image size could not be loaded')
        );
    }, [source]);

    return size;
}
