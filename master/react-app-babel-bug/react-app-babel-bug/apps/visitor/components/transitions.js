import { spring } from 'react-router-transition';

export const fadeConfig = { stiffness: 200, damping: 22 };
export const slideConfig = { stiffness: 330, damping: 30 };

export const slideLeft = {
    atEnter: {
        opacity: 0,
        offset: 100,
    },
    atLeave: {
        opacity: spring(0, fadeConfig),
        offset: spring(-100, slideConfig),
    },
    atActive: {
        opacity: spring(1, slideConfig),
        offset: spring(0, slideConfig),
    },
    mapStyles: styles => ({
        opacity: styles.opacity,
        transform: `translateX(${styles.offset}%)`,
    }),
};

export const slideRight = {
    atEnter: {
        opacity: 0,
        offset: -100,
    },
    atLeave: {
        opacity: spring(0, fadeConfig),
        offset: spring(100, slideConfig),
    },
    atActive: {
        opacity: spring(1, slideConfig),
        offset: spring(0, slideConfig),
    },
    mapStyles: styles => ({
        opacity: styles.opacity,
        transform: `translateX(${styles.offset}%)`,
    }),
};