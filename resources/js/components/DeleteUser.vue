<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
import { ref, useTemplateRef } from 'vue';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import AppAlert from '@/components/AppAlert.vue';
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';
import AppModal from '@/components/AppModal.vue';
import PasswordInput from '@/components/PasswordInput.vue';

const passwordInput = useTemplateRef('passwordInput');
const showModal = ref(false);
</script>

<template>
    <AppCard class="p-6">
        <div class="mb-5">
            <h2 class="text-lg font-semibold text-on-surface">
                Eliminar cuenta
            </h2>
            <p class="mt-1 text-sm text-text-secondary">
                Elimina tu cuenta y todos sus recursos.
            </p>
        </div>

        <AppAlert variant="danger" title="Advertencia" class="mb-5">
            Procede con precaución, esta acción no se puede deshacer.
        </AppAlert>

        <AppButton
            variant="danger"
            data-test="delete-user-button"
            @click="showModal = true"
        >
            Eliminar cuenta
        </AppButton>

        <AppModal
            v-model:open="showModal"
            title="¿Seguro que deseas eliminar tu cuenta?"
            description="Una vez eliminada tu cuenta, todos los recursos y datos se eliminarán permanentemente."
        >
            <Form
                v-bind="ProfileController.destroy.form()"
                reset-on-success
                @error="() => passwordInput?.focus()"
                :options="{
                    preserveScroll: true,
                }"
                class="space-y-6"
                v-slot="{ errors, processing, reset, clearErrors }"
            >
                <div class="grid gap-2">
                    <label
                        for="password"
                        class="text-sm font-medium text-text-primary"
                        >Contraseña</label
                    >
                    <PasswordInput
                        id="password"
                        name="password"
                        ref="passwordInput"
                        placeholder="Contraseña"
                        :error="errors.password"
                    />
                </div>

                <div class="flex justify-end gap-3">
                    <AppButton
                        variant="ghost"
                        @click="
                            () => {
                                clearErrors();
                                reset();
                                showModal = false;
                            }
                        "
                    >
                        Cancelar
                    </AppButton>
                    <AppButton
                        type="submit"
                        variant="danger"
                        :loading="processing"
                        data-test="confirm-delete-user-button"
                    >
                        Eliminar cuenta
                    </AppButton>
                </div>
            </Form>
        </AppModal>
    </AppCard>
</template>
