export default {
  Success: 20000,
  Authorization: 'Authorization',
  Controls: () => {
    const controls: any[] = [
      'headings', 'bold', 'italic', 'underline', 'text-color', 'strike-through', 'superscript', 'subscript', 'remove-styles', 'emoji', 'text-align',
      'text-indent', 'link', 'list-ul', 'list-ol', 'blockquote', 'code', 'media', 'hr', 'clear',
    ];
    return controls;
  },
  Upload: '/api/admin/upload',
};