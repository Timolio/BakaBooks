<template>
    <Transition name="run">
        <div v-if="show" class="loading">
            <div class="list-icon">
                <img src="/img/loading-icon.png" style="height: 80px" />
            </div>
            <p>Загрузка...</p>
        </div>
    </Transition>
</template>

<script setup>
defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped>
/* Общая анимация появления/исчезновения контейнера */
.run-enter-active,
.run-leave-active {
    transition: opacity 0.5s ease-in-out;
}

/* Начальное состояние при входе */
.run-enter-from {
    opacity: 1;
    transform: scale(0.9);
}

.run-leave-active p {
    animation: fade 0.4s ease-in-out forwards;
}

/* Конечное состояние при выходе */
/* .run-leave-to {
    opacity: 1;
} */

/* Остановка вращения и движение картинки */
.run-leave-active .list-icon img {
    animation: slide-out 0.6s ease-in-out forwards;
}

.list-icon img {
    animation: spin 1s linear infinite;
}

.loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    z-index: 5000;
}

p {
    font-weight: 500;
}

@keyframes spin {
    0% {
        transform: rotate(0deg); /* Начальное положение */
    }
    100% {
        transform: rotate(-360deg); /* Полный оборот */
    }
}

@keyframes fade {
    0% {
        opacity: 1; /* Начальное положение */
    }
    100% {
        opacity: 0; /* Полный оборот */
    }
}

@keyframes slide-out {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(120vw); /* Уходит за экран */
    }
}
</style>
