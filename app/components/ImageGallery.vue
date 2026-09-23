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
    <section v-if="images" ref="dropZoneRef" class="relative min-h-screen mx-auto max-w-[1960px] px-4 md:px-8 py-4">
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

      <div class="w-full masonry-container">
        
        <!-- 优化后的 Welcome 卡片：紧凑、高级、带邮箱 -->
        <div v-if="!loggedIn" class="masonry-item relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900/80 to-black border border-white/5 p-5 sm:p-6 min-h-[180px] flex flex-col justify-center">
          <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          
          <div class="relative z-10 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-3">
              <div class="w-7 h-7 flex items-center justify-center bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span class="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
                Visual Gallery
              </span>
            </div>
            
            <div class="flex flex-col gap-1">
              <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Fairy.li</span>
              </h1>
              <p class="text-xs sm:text-sm text-gray-500 max-w-[200px] leading-relaxed border-l-2 border-indigo-500/50 pl-3">
                探索视觉的无限可能。
              </p>
            </div>

            <!-- 🌟 新增：精致的底部邮箱展示 -->
            <div class="mt-2 pt-3 border-t border-white/5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:x@fairy.li" class="text-xs text-gray-400 hover:text-indigo-400 transition-colors font-mono tracking-wide">
                x@fairy.li
              </a>
            </div>
          </div>
        </div>
        
        <div v-if="loggedIn" class="masonry-item">
          <input ref="fileInput" class="hidden" type="file" accept="image/*" @change="fileSelection">
          <UploadButton :uploading="uploadingImg" type="submit" class="mb-6" :is-over-drop-zone="isOverDropZone"
            @click="openFilePicker" />
        </div>

        <!-- 恢复使用真实的 images 数据 -->
        <template v-if="images && images.length">
          <div v-for="image in images" :key="image.pathname" class="masonry-item relative group">
            
            <UButton v-if="loggedIn" :loading="deletingImg === image.pathname" color="white"
              icon="i-heroicons-trash-20-solid"
              class="absolute top-4 right-4 z-[9999] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              @click="deleteFile(image.pathname)" />
              
            <NuxtLink :to="`/detail/${image.pathname.split('.')[0]}`" @click="active = image.pathname.split('.')[0]" class="block">
              <img v-if="image" 
                :src="`/images/${image.pathname}`"
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

.masonry-container {
  column-count: 1;
  column-gap: 16px;   /* 对齐 Next 的 gap-4 */
  margin: 0;
  padding: 0;
}

@media screen and (min-width: 640px) {
  .masonry-container {
    column-count: 2;  /* 原 3 → 改 2 */
    column-gap: 24px; /* 对齐 sm:gap-6 */
  }
}

@media screen and (min-width: 1024px) {
  .masonry-container {
    column-count: 3;  /* 原 4 → 改 3 */
  }
}

@media screen and (min-width: 1280px) {
  .masonry-container {
    column-count: 4;  /* 新增，对齐 Next 的 xl:columns-4 */
  }
}

/* 删除原来 1536px 的 5 列规则，或者保留但改成 4 列也行 */

.masonry-item {
  display: inline-block;
  margin: 0 0 16px 0;   /* 原 8px → 改 16px */
  width: 100%;
  break-inside: avoid;
  page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
}

@media screen and (min-width: 640px) {
  .masonry-item {
    margin-bottom: 24px; /* 对齐 sm:mb-6 */
  }
}
</style>