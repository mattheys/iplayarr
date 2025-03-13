import AlertDialog from '@/components/modals/AlertDialog.vue';
import { useModal } from 'vue-final-modal'

const dialogService = {
    alert : (title, text) => {
        const formModal = useModal({
            component: AlertDialog,
            attrs: {
                title,
                text,
                onConfirm : () => {
                    formModal.close();
                }
            }
        });
        formModal.open();
    },

    confirm : async (title, text) => {
        return new Promise((resolve) => {
            const formModal = useModal({
                component: AlertDialog,
                attrs: {
                    title,
                    text,
                    showCancel : true,
                    onConfirm : () => {
                        resolve(true);
                        formModal.close();
                    },
                    onCancel : () => {
                        resolve(false);
                        formModal.close();
                    }
                }
            });
            formModal.open();
        });
    }
}

export default dialogService;