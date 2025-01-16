<template>
    <!-- Hidden file input -->
    <input
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="onFileSelected"
        style="display: none"
    />
</template>

<script setup>
const fileInput = ref(null);

const emit = defineEmits(['uploaded', 'uploading']);

const trigger = () => {
    fileInput.value.click();
};

defineExpose({
    trigger,
});

const onFileSelected = async () => {
    const file = fileInput.value.files[0];
    if (file) {
        emit('uploading');
        await uploadImage(file);
    }
};

const uploadImage = async file => {
    if (!file) return null;
    // запрашиваем url для заливки
    const { body } = await $fetch('/api/upload', {
        headers: { 'Content-Type': file.type },
    });
    const { url, pub } = body;

    await $fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
    });
    emit('uploaded', pub);
};
</script>
