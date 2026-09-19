<script setup lang="ts">
import { Form, Head, usePage } from '@inertiajs/vue3';
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import AppAlert from '@/components/AppAlert.vue';
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';
import AppInput from '@/components/AppInput.vue';
import DeleteUser from '@/components/DeleteUser.vue';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Configuración del perfil',
                href: edit(),
            },
        ],
    },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
</script>

<template>
    <Head title="Configuración del perfil" />

    <h1 class="sr-only">Configuración del perfil</h1>

    <AppCard class="p-6">
        <div class="mb-6">
            <h2 class="text-lg font-semibold text-on-surface">Perfil</h2>
            <p class="mt-1 text-sm text-text-secondary">
                Actualiza tu nombre y correo electrónico.
            </p>
        </div>
        <Form
            v-bind="ProfileController.update.form()"
            class="space-y-6"
            v-slot="{ errors, processing }"
        >
            <div>
                <AppInput
                    id="name"
                    name="name"
                    :default-value="user.name"
                    required
                    autocomplete="name"
                    placeholder="Nombre completo"
                    label="Nombre"
                    :error="errors.name"
                />
            </div>

            <div>
                <AppInput
                    id="email"
                    type="email"
                    name="email"
                    :default-value="user.email"
                    required
                    autocomplete="username"
                    placeholder="Correo electrónico"
                    label="Correo electrónico"
                    :error="errors.email"
                />
            </div>

            <div v-if="page.props.mustVerifyEmail && !user.email_verified_at">
                <p class="-mt-4 text-sm text-text-secondary">
                    Tu correo electrónico no está verificado.
                    <Link
                        :href="send()"
                        as="button"
                        class="text-on-surface underline underline-offset-4 transition hover:text-on-surface/80"
                    >
                        Haz clic aquí para reenviar el correo de verificación.
                    </Link>
                </p>

                <AppAlert
                    v-if="page.props.status === 'verification-link-sent'"
                    variant="success"
                    class="mt-3"
                >
                    Se envió un nuevo enlace de verificación a tu correo
                    electrónico.
                </AppAlert>
            </div>

            <div class="flex items-center gap-4">
                <AppButton
                    :loading="processing"
                    data-test="update-profile-button"
                >
                    Guardar cambios
                </AppButton>
            </div>
        </Form>
    </AppCard>

    <DeleteUser />
</template>
