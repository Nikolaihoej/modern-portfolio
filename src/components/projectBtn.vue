<template>
    <div class="btn btn-project">
        <a v-bind="$attrs">
            <slot></slot>
        </a>
    </div>
</template>

<script setup></script>
<style>
.btn-project {
    background: var(--content-bg-dark);
    border: 1px solid var(--border-dark);
    color: var(--text-dark);
}

.btn-project a {
    text-decoration: none;
    color: inherit;
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