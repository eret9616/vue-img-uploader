<template>
    <div class="_container">
            <div class='img_area img_input_area' v-show='!filled' @click='selectFile'>+</div>
            <input type="file" class='hidden_field'>
            <div class="img_area img_thumb_area" v-show='filled'>
                <div class="img_thumb_area_cancel_btn" @click='reset'>×</div>
                <img class='img_thumb_area_imgsrc' ref='thumb' :src="thumbSrc" alt="">
            </div>
    </div>
</template>

<script>
import { types } from './mime_type.js'
export default {

    data () {
        return {
            img: null,
            thumbSrc: null
        }
    },
    props: {
        config: Object,
        output: Array
    },
    computed: {
        filled () {
            return this.thumbSrc != null
        },
        ext () {
            let ext = this.config.ext
            if (ext === 'jpg')
                return 'jpeg'
            return ext || '*'
        }
    },
    methods: {
        reset () {
            this.thumbSrc = null
            for (let i = 0; i < this.output.length; i++) {
                if (this.output[i] == this.img) {
                    this.output.splice(i, 1)
                }
            }
        },
        selectFile (e) {
            this.checkConfig()
            let hiddenFiled = e.target.nextSibling
            hiddenFiled.addEventListener('change', this.handleFileSelect)
            hiddenFiled.value = null
            hiddenFiled.click()
        },
        handleFileSelect (e) {
            this.img = e.target.files[0]
            this.checkExt(this.img, this.ext)
            this.checkConstraint(this.img)
        },
        checkConfig () {
            if (!types.includes(this.ext)) {
                throw new Error('image/' + types)
            }
        },
        checkExt (img, ext) {
            if (!img.type.match(`image.${ext}`)) {
                if (ext == '*') ext = '图片'
                alert(`请选择${ext}文件!`)
                throw new Error(ext)
            }
        },
        checkConstraint (img) {
            if (typeof (this.config.size) == 'function')
                if (this.config.size(img.size) === false) return
            let reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = (e) => {
                let image = new Image();
                image.src = e.target.result
                image.onload = () => {
                    if (typeof (this.config.width) == 'function')
                        if (this.config.width(image.width) === false) return
                    if (typeof (this.config.height) == 'function')
                        if (this.config.height(image.height) === false) return
                    this.thumbSrc = image.src
                    this.output.push(img)
                }
            }
        }
    }
}
</script>


<style scoped>
._container {
  display: inline-block;
  vertical-align: bottom;
}
.img_area {
  width: 200px;
  height: 200px;
  border: 2px dashed #ccc;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size:2em;
}
.img_input_area {
  cursor: pointer;
  user-select: none;
}
.img_thumb_area_cancel_btn {
  width: 20px;
  height: 20px;
  font-size: 0.8em;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  color: #000;
  border: 0.5px solid #ccc;
  position: absolute;
  right: -10px;
  top: -10px;
  user-select: none;
}
.img_thumb_area_imgsrc {
  height: 100%;
  width: 100%;
}
.hidden_field {
  display: none;
}
</style>
