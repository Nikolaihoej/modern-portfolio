<template>
    <div class="btn btn-project" v-bind="$attrs">
        <slot></slot>
    </div>
</template>

<script setup></script>
<style>
.btn-project {
    background: var(--content-bg-dark);
    border: 1px solid var(--border-dark);
    color: var(--text-dark);
}
.light .btn-project {
    background: var(--content-bg-light);
    border: 1px solid var(--border-light);
    color: var(--text-light);
}
.btn-project:hover {
    background: var(--border-dark-hover);
    color: var(--text-dark);
}
.light .btn-project:hover {
    background: var(--border-light-hover);
    color: var(--text-light);
}
</style>