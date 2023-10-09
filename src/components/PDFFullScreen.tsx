"use client"

import { useState } from "react"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Expand, Loader2 } from "lucide-react"
import { DialogContent } from "@radix-ui/react-dialog"
import SimpleBar from "simplebar-react"
import { Document, Page } from "react-pdf"
import { useToast } from "./ui/use-toast"
import { useResizeDetector } from "react-resize-detector"

interface PDFFullScreenProps {
    url: string
}

const PDFFullScreen = ({ url }: PDFFullScreenProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [numPages, setNumPages] = useState<number | undefined>(undefined)

    const { width, ref } = useResizeDetector()


    const { toast } = useToast()

    return (
        <Dialog open={isOpen} onOpenChange={(v) => {
            if (!v) {
                setIsOpen(v)
            }
        }}>
            <DialogTrigger asChild onClick={() => {
                setIsOpen(true)
            }}>
                <Button aria-label="fullscreen" variant={'ghost'} className="gap-1.5">
                    <Expand className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl w-full">
                <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
                    <div ref={ref}>
                        <Document
                            loading={
                                <div className='flex justify-center'>
                                    <Loader2 className='my-24 h-6 w-6 animate-spin' />
                                </div>
                            }
                            onLoadSuccess={({ numPages }) => {
                                setNumPages(numPages)
                            }}
                            onLoadError={() => {
                                toast({
                                    title: "Error loading PDF",
                                    description: "Please try again later",
                                    variant: 'destructive'
                                })
                            }}
                            file={url}
                            className='max-h-full'>
                            {new Array(numPages).fill(0).map((_, index) => (
                                <Page key={index} pageNumber={index + 1} />
                            ))}
                        </Document>
                    </div>
                </SimpleBar>
            </DialogContent>
        </Dialog>
    )
}

export default PDFFullScreen