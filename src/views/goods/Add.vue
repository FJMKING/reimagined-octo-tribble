<template>
  <div class="add">
    <el-steps
      :active="active-0"
      finish-status="success"
      process-status="process"
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <template>
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
        style="margin-top:15px"
      >
        <el-tabs
          v-model="active"
          tab-position="left"
        >
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <el-form-item
              label="商品名称"
              prop="goods_name"
            >
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              prop="goods_price"
            >
              <el-input
                v-model="addForm.goods_price"
                type="number"
                :min="0"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量"
              prop="goods_number"
            >
              <el-input
                v-model="addForm.goods_number"
                type="number"
                :min="0"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量"
              prop="goods_weight"
            >
              <el-input
                v-model="addForm.goods_weight"
                type="number"
                :min="0"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品分类"
              prop="goods_cat"
            >
              <el-cascader
                :clearable="true"
                :options="options"
                v-model="selectedOptions"
                @change="handleChange"
                :props="defaultProps"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品参数"
            name="1"
          >
            商品参数
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >

    <div class="amap-wrapper">
      <el-amap class="amap-box" :vid="'amap-vue'"  :center="center" :plugin="plugin"></el-amap>
       <div class="toolbar">
        <span v-if="loaded">
          location: lng = {{ lng }} lat = {{ lat }}
        </span>
        <span v-else>正在定位</span>
      </div>
    </div>
          </el-tab-pane>
          <el-tab-pane
            label="商品图片"
            name="3"
          >
            <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :headers="getToken()"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-before-upload="handlebeforeUpload"
              :on-success="handleDone"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
              >只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane
            label="商品内容"
            name="4"
          >
                    <quill-editor
                      v-model="addForm.goods_introduce"
                      ref="myQuillEditor"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"

                    >
                    </quill-editor>

          </el-tab-pane>
          <el-tab-pane
            label="完成"
            name="5"
          >完成</el-tab-pane>
        </el-tabs>
      </el-form>
    </template>
    <el-button
      type="success"
      class="btn"
      @click="submitDoods"
    >确认添加</el-button>
     <!-- 图片预览 -->
  <el-dialog title="图片查看" :visible.sync="picdialogTableVisible">
    <img :src="userpic" alt="">
  </el-dialog>
  </div>

</template>
<script>
import { getGoodsCategories, addGoods } from '@/api'
export default {
  data () {
    let self = this
    return {
      center: [121.59996, 31.197646],
      lng: 0,
      lat: 0,
      loaded: false,
      plugin: [{
        pName: 'Geolocation',
        events: {
          init (o) {
            // o 是高德地图定位插件实例
            o.getCurrentPosition((status, result) => {
              if (result && result.position) {
                self.lng = result.position.lng
                self.lat = result.position.lat
                self.center = [self.lng, self.lat]
                self.loaded = true
                self.$nextTick()
              }
            })
          }
        }
      }],
      editorOption: {},
      userpic: '',
      picdialogTableVisible: false,
      fileList: [],
      selectedOptions: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      active: '0',
      options: [],
      addForm: {
        goods_name: '',
        goods_price: '1',
        goods_number: '0',
        goods_weight: '0',
        goods_cat: '',
        goods_introduce: '',
        pics: [],
        attrs: ''
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    getGoodsCategories({ type: 3 }).then(res => {
      //   console.log(res)
      this.options = res.data
    })
  },
  methods: {

    submitDoods () {
      addGoods(this.addForm).then(res => {
        if (res.meta.status === 201) {
          this.$message.success('添加商品成功')
          this.$router.push({name: 'Lists'})
        }
      })
    },
    onEditorBlur ($event) {
      console.log(this.addForm)
    },
    // 设置token
    getToken () {
      var token = localStorage.getItem('itcast-token')
      return { Authorization: token }
    },
    handleChange (value) {
      // console.log(value)
      this.addForm.goods_cat = value.join(',')
    },
    // 删除图片
    handleRemove (file, fileList) {
      // console.log(file)
      // console.log(11)
      // 删除图片
      var deletePic = file.response.data.tmp_path
      // console.log(deletePic)
      var index = this.addForm.pics.findIndex(value => {
        return value.pic.indexOf(deletePic) !== -1
      })
      this.addForm.pics.splice(index, 1)
    },
    // 图片预览
    handlePreview (file) {
      // console.log(file)
      this.picdialogTableVisible = true
      this.userpic = 'http://localhost:8888/' + file.response.data.tmp_path
    },
    // 上传完成之前
    handlebeforeUpload (file) {
      //   console.log(file)
      if (file.size > 500 * 1024) {
        this.$message.waring('图片大小超出指定大小')
        return false
      }
    },
    // 上传完成
    handleDone (response, file, fileList) {
      // console.log(response)
      // console.log(file)
      // console.log(fileList)
      this.addForm.pics.push({ pic: '/' + file.response.data.tmp_path })
      // console.log(this.addForm.pics)
    }
  }
}
</script>
 <style lang="scss" scoped>
.btn {
  margin-bottom: 10px;
  float: right;
}
.quill-editor{
  height: 300px;
  border-bottom: 1px solid #ccc;
  .ql-container{
  height: 200px;
  }
}
.amap-wrapper {
  width: 500px;
  height: 500px;
}
</style>
