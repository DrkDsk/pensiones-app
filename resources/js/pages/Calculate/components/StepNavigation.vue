<script setup lang="ts">
import AppButton from '@/components/AppButton.vue';

defineProps<{
    currentStep: number;
    totalSteps: number;
    processing: boolean;
}>();

const emit = defineEmits<{
    previous: [];
    next: [];
}>();
</script>

<template>
    <div
        class="flex items-center justify-between gap-3 border-t border-slate-200 px-6 py-5 sm:px-8 dark:border-slate-800"
    >
        <AppButton
            variant="ghost"
            :disabled="currentStep === 1"
            @click="emit('previous')"
        >
            Anterior
        </AppButton>

        <AppButton
            :loading="processing"
            :disabled="processing"
            @click="emit('next')"
        >
            {{ currentStep === totalSteps ? 'Finalizar' : 'Continuar' }}
        </AppButton>
    </div>
</template>
