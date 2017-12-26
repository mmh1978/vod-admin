<template>
    <select>
        <slot></slot>
    </select>
</template>
<script>
    import $ from 'jquery'
    import 'select2'
    import 'select2/dist/css/select2.min.css'
    export default {
      name: 'select2',
      props: ['options', 'value'],
      mounted() {
        $(this.$el)
          .select2({data: this.options})
          .val(this.value)
          .trigger('change')
          .on('change', () => {
            this.$emit('input', this.value);
          });
      },
      watch: {
        value(value) {
          $(this.$el).val(value).trigger('update');
        },
        options(options) {
          $(this.$el).empty().select2({data: options});
        }
      },
      destroyed() {
        $(this.$el).off().select2('destroy');
      }
    }
</script>