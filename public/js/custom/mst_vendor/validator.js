export function isValid() {
  const namePerusahaan = validateElement($('#nm_perusahaan'));
  const noNpwp = validateElement($('#no_npwp'));
  const city = validateElement($('#id_postal_code'));
  const noTelp = validateElement($('#no_telp'));
  const email = validateElement($('#email'));
  const address = validateElement($('#address'));

  if(namePerusahaan && noNpwp && city && noTelp && email &&  address) {
    return true;
  } else {
    return false;
  }
}


$('#nm_perusahaan').on('input', function(){
  validateElement($(this));
});

$('#no_npwp').on('input', function(){
  validateElement($(this));
});

$('#id_postal_code').on('change', function(){
    validateElement($(this));
});

$('#no_telp').on('input', function(){
  validateElement($(this));
});

$('#email').on('input', function(){
  validateElement($(this));
});

$('#address').on('input', function(){
  validateElement($(this));
});


function validateElement(element) {
    const value = $(element).val();
    if(!value || value.trim() === ''){
      $(element).addClass('is-invalid');
      var errorContainer = $(`<div></div>`).text("Lengkapi bidang ini");
      errorContainer.addClass('invalid-feedback');
      $(element).after(errorContainer);
      return false; 
    } else {
      element.removeClass('is-invalid');
      element.siblings('.invalid-feedback').text('');
      return true;
    }
}