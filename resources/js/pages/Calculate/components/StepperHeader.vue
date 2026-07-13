<script setup lang="ts">
import type { CalculateStep } from '../types/calculate';

const props = defineProps<{
    steps: CalculateStep[];
    currentStep: number;
    progressWidth: string;
}>();

const emit = defineEmits<{
    goToStep: [step: number];
}>();
</script>

<template>
    <div
        class="border-b border-slate-200 px-6 py-5 sm:px-8 dark:border-slate-800"
    >
        <div class="flex flex-col gap-5">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p
                        class="text-primary-600 dark:text-primary-300 text-xs font-semibold tracking-[0.24em] uppercase"
                    >
                        Formulario de registro
                    </p>
                    <h2
                        class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
                    >
                        Captura ordenada para el cálculo de pensión
                    </h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Avanza paso a paso y revisa todo antes de finalizar el
                        registro.
                    </p>
                </div>

                <div
                    class="hidden min-w-36 rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-right sm:block dark:border-slate-800 dark:bg-slate-950/60"
                >
                    <p
                        class="text-xs tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500"
                    >
                        Progreso
                    </p>
                    <p
                        class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100"
                    >
                        {{ currentStep }}/{{ props.steps.length }}
                    </p>
                </div>
            </div>

            <div class="relative">
                <div
                    class="absolute top-5 right-0 left-0 h-px bg-slate-200 dark:bg-slate-800"
                />
                <div
                    class="bg-primary-500 absolute top-5 left-0 h-px transition-all duration-300"
                    :style="{ width: progressWidth }"
                />

                <div class="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <button
                        v-for="step in steps"
                        :key="step.id"
                        type="button"
                        class="text-left"
                        @click="emit('goToStep', step.id)"
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-sm border text-sm font-semibold transition-all duration-200"
                                :class="
                                    step.id === currentStep
                                        ? 'bg-primary-500 border-slate-200 text-slate-200 shadow-sm dark:text-slate-200'
                                        : step.id < currentStep
                                          ? 'bg-primary-500/10 border-slate-400 text-slate-400 dark:border-gray-700 dark:text-slate-400'
                                          : 'border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500'
                                "
                            >
                                {{ step.id }}
                            </div>

                            <div class="min-w-0">
                                <p
                                    class="text-sm font-medium"
                                    :class="
                                        step.id === currentStep
                                            ? 'text-slate-600 dark:text-slate-100'
                                            : step.id < currentStep
                                              ? 'text-slate-600 dark:text-slate-400'
                                              : 'text-slate-400 dark:text-slate-400'
                                    "
                                >
                                    {{ step.label }}
                                </p>
                                <p
                                    class="text-xs text-slate-400 dark:text-slate-500"
                                >
                                    {{ step.helper }}
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
