/** True for sources the background should play as <video> (by file extension). */
export const isVideoSrc = (src: string) => /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(src)
