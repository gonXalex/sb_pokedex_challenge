import { ReactNode, useRef } from 'react'
import { 
     Modal, ModalOverlay, ModalContent,ModalHeader, 
    ModalCloseButton, ModalBody,
} from '@chakra-ui/react'

type ModalType = {
    children: ReactNode;
    open: boolean;
    toggle: () => void;
    title: string;
}

export default function Dialog({ children, open, title, toggle }: ModalType) {
    const initialRef = useRef(null)
    return (
        <Modal
            initialFocusRef={initialRef}
            isOpen={open}
            onClose={toggle}
        >
            <ModalOverlay />
            <ModalContent minWidth="fit-content">
                <ModalHeader>
                    <p className='text-[35px]'>
                        {title}
                    </p>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    { children }
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}