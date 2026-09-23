<script setup lang="ts">
const isOpen = ref(false)

const dropZoneRef = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const mansoryItem = ref<Array<HTMLElement>>([])
const deletingImg = ref('')
const uploadingImg = ref(false)
const disconnect = ref(false)

const toast = useToast()
const { uploadImage, deleteImage, images } = useFile()
const { loggedIn, clear } = useUserSession()

const active = useState()

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

function openFilePicker () {
  fileInput.value?.click()
}

async function fileSelection (event: Event) {
  const target = event.target as HTMLInputElement

  if (target.files?.[0]) {
    await uploadFile(target.files[0])
  }
}

async function onDrop (files: File[] | null) {
  if (files) {
    await uploadFile(files[0] as File)
  }
}

async function uploadFile (file: File) {
  uploadingImg.value = true

  await uploadImage(file)
    .catch(() => toast.add({ title: '发生错误', description: '请重试', color: 'red' }))
    .finally(() => uploadingImg.value = false)
}

async function deleteFile (pathname: string) {
  deletingImg.value = pathname

  await deleteImage(pathname)
    .catch(() => toast.add({ title: '发生错误', description: '请重试', color: 'red' }))
    .finally(() => deletingImg.value = '')
}

async function clearSession () {
  disconnect.value = true

  await clear().finally(() => disconnect.value = false)
}
</script>

<template>
  <div>
    <!-- 👇 核心修复：将 p-4 改为 px-0 sm:px-4 py-4，确保手机端左右绝对为 0 -->
    <section v-if="images" ref="dropZoneRef" class="relative min-h-screen px-0 sm:px-4 py-4">
      <BottomMenu class="bottom-menu">
        <template #logo>
          <img src="/logo.svg" width="29" height="20">
        </template>
        <template #description>
          <div class="flex gap-x-4 items-center">
            <p class="bottom-menu-description text-sm sm:text-base leading-tight sm:leading-normal">
              Fairy.li
            </p>
            <NuxtLink to="https://github.com/lx521603/nuxt-image-gallery" target="blank" class="flex items-center">
              <UIcon name="i-simple-icons-github" class="w-5 h-5" />
            </NuxtLink>
          </div>
        </template>
        <template #buttons>
          <div class="flex gap-x-2">
            <UButton v-if="loggedIn" :loading="disconnect" icon="i-heroicons-power-20-solid" color="red" variant="ghost"
              @click="clearSession" />
            <UModal v-model:open="isOpen" title="您必须登录才能开始上传图片" :close="{
              color: 'gray',
              variant: 'outline',
              class: 'rounded-full'
            }">
              <UButton v-if="!loggedIn" label="登录" color="primary" variant="ghost" aria-label="Sign in"
                class="mr-4 sm:mr-0" />
              <template #body>
                <LoginForm @close="isOpen = false" />
              </template>
            </UModal>
          </div>
        </template>
      </BottomMenu>

      <!-- 内部容器 padding 全部清零，完全由外层 section 控制 -->
      <div class="w-full masonry-container">
        
        <div v-if="!loggedIn" class="masonry-item text-2xl text-white flex flex-col gap-y-4 p-4">
          <h1 class="font-medium text-5xl">
            Welcome to Fairy.li
          </h1>
          <p class="text-gray-400">
            您必须登录才能开始上传图片
          </p>
        </div>
        
        <div v-if="loggedIn" class="masonry-item">
          <input ref="fileInput" class="hidden" type="file" accept="image/*" @change="fileSelection">
          <UploadButton :uploading="uploadingImg" type="submit" class="mb-6" :is-over-drop-zone="isOverDropZone"
            @click="openFilePicker" />
        </div>

        <template v-if="images && images.length">
          <div v-for="image in images" :key="image.pathname" class="masonry-item relative group">
            
            <UButton v-if="loggedIn" :loading="deletingImg === image.pathname" color="white"
              icon="i-heroicons-trash-20-solid"
              class="absolute top-4 right-4 z-[9999] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              @click="deleteFile(image.pathname)" />
              
            <NuxtLink :to="`/detail/${image.pathname.split('.')[0]}`" @click="active = image.pathname.split('.')[0]" class="block">
              <img v-if="image" :src="`/images/${image.pathname}`"
                :class="{ imageEl: image.pathname.split('.')[0] === active }"
                class="w-full h-auto block transition-all duration-200 brightness-[.8] hover:brightness-100 will-change-[filter]"
                alt="Gallery Image" />
            </NuxtLink>
            
          </div>
        </template>
        
      </div>
    </section>
    
    <div v-else class="flex items-center space-x-4 z-10 p-4">
      <USkeleton class="h-12 w-12 bg-white-500" :ui="{ rounded: 'rounded-full' }" />
      <div class="space-y-2">
        <USkeleton class="h-4 w-[250px] bg-white-500" />
        <USkeleton class="h-4 w-[200px] bg-white-500" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
@media (min-width: 768px) {
  .imageEl {
    view-transition-name: vtn-image;
  }

  .bottom-menu-description {
    view-transition-name: vtn-bottom-menu-description;
  }

  .bottom-menu-button {
    view-transition-name: vtn-bottom-menu-button;
  }
}

/* 瀑布流容器：内部 padding 彻底清零，完全交给外层 section 控制 */
.masonry-container {
  column-count: 1;
  column-gap: 8px;
  margin: 0;
  padding: 0; 
}

/* 平板端：3列 */
@media screen and (min-width: 640px) {
  .masonry-container {
    column-count: 3;
  }
}

/* 桌面端：4列 */
@media screen and (min-width: 1024px) {
  .masonry-container {
    column-count: 4;
  }
}

/* 宽屏端：5列 */
@media screen and (min-width: 1536px) {
  .masonry-container {
    column-count: 5;
  }
}

/* 瀑布流项目：上下间距 8px */
.masonry-item {
  display: inline-block;
  margin: 0 0 8px 0;
  width: 100%;
  break-inside: avoid;
  page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
}
</style>