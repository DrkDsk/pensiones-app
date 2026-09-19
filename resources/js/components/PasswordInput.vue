<script setup lang="ts">
import { Eye, EyeOff } from '@lucide/vue';
import { ref, useTemplateRef } from 'vue';
import type { HTMLAttributes } from 'vue';
import AppInput from '@/components/AppInput.vue';
import { cn } from '@/lib/utils';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
    class?: HTMLAttributes['class'];
    error?: string;
}>();

const showPassword = ref(false);
const inputRef = useTemplateRef('inputRef');

defineExpose({
    $el: inputRef,
    focus: () => inputRef.value?.focus(),
});
</script>

<template>
    <div>
        <div class="relative">
            <AppInput
                ref="inputRef"
                :type="showPassword ? 'text' : 'password'"
                :class="cn('pr-10', props.class)"
                :error="props.error"
                v-bind="$attrs"
            />
            <button
                type="button"
                class="absolute top-0 right-0 flex h-11 items-center rounded-r-md px-3 text-text-secondary transition hover:text-text-primary"
                @click="showPassword = !showPassword"
                :aria-label="
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                "
                :tabindex="-1"
            >
                <EyeOff v-if="showPassword" class="size-4" />
                <Eye v-else class="size-4" />
            </button>
        </div>
    </div>
</template>
