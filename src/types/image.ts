export interface ImageAGD{
    index: number,
    image : {
        uploadDate?: string,
        secure_url: string,
        deleteState?: boolean
    }
}
export interface ImageAGDObject{
    secure_url: string
}

export interface DropzoneRefProps{
    handleClearImage: () => void
}