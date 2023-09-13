import {isValid} from './validator.js';

$(document).ready(()=> {
    //batal
    $('#batal').click(function() {
        Swal.fire({
        title: "<span style='color:#FF0000;'>Batal?</span>", 
        html: "<strong>Apakah anda yakin ?</strong>",
        icon: 'warning',
        showCancelButton: true, 
        cancelButtonText: "Tidak",
        confirmButtonText: "Iya",
        confirmButtonColor: "#045299",
        reverseButtons: true,
        allowOutsideClick: false
        }).then((result)=>{
        if(result.isConfirmed == true) {
            window.location.assign(`/master-vendor`); 
        }
        });
    });

    // ketika tombol simpan draf ditekan
    $('#draf').click(function() {
        Swal.fire({
            title: "<span style='color:#EDAD51;'>Simpan sebagai draf</span>",
            html: '<strong>Apakah anda yakin ?</strong>', 
            imageUrl: "/media/peralatan/draft.svg",
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Iya', 
            confirmButtonColor: '#045299',
            reverseButtons: true,
            allowOutsideClick: false
        }).then((result)=>{
            if(result.isConfirmed == true) {
                postData("DRAFT");
            }
        });
    });

    // ketika tombol kirim ditekan
    $('#kirim').click(function() {
          Swal.fire({
              title: "<span style='color:#8CE02C;'>Dikirim</span>",
              html: '<strong>Apakah anda yakin ?</strong>', 
              icon: 'warning',
              showCancelButton: true,
              cancelButtonText: "Tidak",
              confirmButtonText: 'Iya', 
              confirmButtonColor: '#045299',
              reverseButtons: true,
              allowOutsideClick: false
          }).then((result)=>{
              if(result.isConfirmed == true) {
                if(isValid()){
                  // postData("REQUEST");
                }
              }
            });
    });

    // format npwp
    $('#no_npwp').keyup(function() {
        var npwp = $('#no_npwp')
        let formaterVal = npwp.val().replace(/\D/g, "");
        formaterVal = formaterVal.substring(0, 18); 
        formaterVal = formaterVal.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})$/, "$1.$2.$3.$4-$5.$6");
        $(this).val(formaterVal)
    })

    $('#no_npwp').change(function() {
          $('#no_npwp').keyup(function() {
            var npwp = $('#no_npwp');
            let formaterVal = npwp.val().replace(/\D/g, "");
            formaterVal = formaterVal.substring(0, 18); 
            formaterVal = formaterVal.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})$/, "$1.$2.$3.$4-$5.$6");
            $(this).val(formaterVal);
          });
    });
});





function bankAccount() {
  let dataBankAccount = [];
  let bankName =  Array.from(document.querySelectorAll(".nm_bank"), input => input.value);
  let accountHolder =  Array.from(document.querySelectorAll(".account_holder"), input => input.value);
  let noRek =  Array.from(document.querySelectorAll(".no_rek"), input => input.value);
  let savingBook =  Array.from(document.querySelectorAll(".saving_book"), input => input.value);
  accountHolder?.forEach((val,index)=>{
    dataBankAccount.push({
      'nm_bank': bankName[index],
      'account_holder': val,
      'no_rek': noRek[index],
      'buku_tabungan': savingBook[index],
    })
  })
  return dataBankAccount
}

function postData(status) {
    $.ajax({
        url: `/master-vendor/store`,
        type: 'post',
        beforeSend: function() {
        blockUI.block();
        },
        data: {
          'status': status,
          'nm_perusahaan' : $('#nm_perusahaan').val() ? $('#nm_perusahaan').val() : '',
          'no_npwp' : $('#no_npwp').val() ? $('#no_npwp').val().replace(/[.-]/g, "") : '',
          'email' : $('#email').val() ? $('#email').val() : '',
          'kd_vendor' : $('#kd_vendor').val() ? $('#kd_vendor').val() : '',
          'kd_sap' : $('#kd_sap').val() ? $('#kd_sap').val() : '',
          'phone' : $('#no_telp').val() ? $('#no_telp').val() : '',
          'address' : $('#address').val() ? $('#address').val() : '',
          'city_id' : $('#id_postal_code').val() ? $('#id_postal_code').val() : '',
          'jn_vendor_id' : $('#jn_vendor_id').val() ? $('#jn_vendor_id').val() : '',
          'reference_id' : $('#reference_id').val() ? $('#reference_id').val() : '',
          'bank_account' : bankAccount().length > 0 ? bankAccount(): [],
          // 'account_holder' : $('#account_holder').val() ? $('#account_holder').val() : '',
          // 'no_rek' : $('#no_rek').val() ? $('#no_rek').val() : '',
          // 'nm_bank' : $('#nm_bank').val() ? $('#nm_bank').val() : '',
          // 'buku_tabungan' : $('#saving_book').val() ? $('#saving_book').val() : '',
        },
        success: function(data) {
          blockUI.release();
          Swal.fire({
              title: "<span style='color:#8CE02C;'>Sukses</span>", 
              html: `<strong>${data.message}</strong>`, 
              icon:'success',
              confirmButtonText: "Lanjutkan",
              confirmButtonColor: "#045299",
              allowOutsideClick: false
            }).then(()=>{
              window.location.assign(`/master-vendor`);
            //   window.location.assign(`/master-customer?request=outstanding&status=${status}`);
            });
        },
        error: function(data) {
          blockUI.release();
          if(data.responseJSON?.errors.length > 0) {
            let errorMessage = ''
            data.responseJSON?.errors.map(el => {
              errorMessage += el.message + '<br>'
            })
            Swal.fire({
                title: "<span style='color:#FF0000;'>Gagal</span>", 
                html: `<strong>${errorMessage}</strong>`, 
                icon: "error",
                confirmButtonText: "Baik", 
                confirmButtonColor: "#045299",
                allowOutsideClick: false
              })
          } else {
            Swal.fire({
                title: "<span style='color:#FF0000;'>Gagal</span>", 
                html: `<strong>${data.responseJSON.message}</strong>`, 
                icon: "error",
                confirmButtonText: "Baik", 
                confirmButtonColor: "#045299",
                allowOutsideClick: false
              })
          }
        }
      })
};

