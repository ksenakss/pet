import { toast } from 'vue3-toastify';
import api from '@/api';
import ProcedureReturnToPublished from "@/components/procedure/ProcedureReturnToPublished.vue";

export const MainActions = {
    actionsMap: {
        recallApplication: {
            text: 'Отозвать',
            async handler(ctx) {
                const application = await ctx.$refs.confirm.open(
                    'Отзыв заявки',
                    `Вы действительно хотите отозвать поданную заявку по процедуре ${ctx.item.p.registryNumber}?`
                );
                if (application) {
                    const procedureId = ctx.item.p.id;
                    try {
                        ctx.loadingDialogText = 'Заявка отзывается';

                        await api.delete(`/procedures/cancelApplication/${procedureId}`);

                        ctx.tableModel.reload();
                    } catch (e) {
                        toast.error(e.message);
                    } finally {
                        ctx.loadingDialogText = null;
                    }
                }
            },
        },
    },

    /**
     * Возвращает массив действий.
     * @param {string[]} mainActions
     * @returns {Array<{ text: string, handler: Function }>}
     */
    getActions(mainActions, ctx) {
        const me = this;
        return mainActions
            .map((actionName) => {
                const action = this.actionsMap[actionName];
                if (!action) {
                    toast.error(`Действие "${actionName}" не найдено`);
                    return null;
                }
                return {
                    text: action.text,
                    handler: function () {
                        action.handler(ctx, me);
                    },
                };
            })
            .filter((action) => action);
    },
};
