$(document).ready(function() { 
    //hide npwp mandatory bullet
    let identityType = $('#npwp-type').val();
    if(identityType != '1') {
      $('.npwp-bullet').hide();
    } else {
      $('.npwp-bullet').show();
    } 

    //customer type bullet mandtory
    let customertype = $('select[name="id_customer_type"]').find('option:selected').text();
    if(customertype === "Pelanggan"){
      $('.type-usaha-mitra').hide()
      $('.type-usaha-pelanggan').show()
    } else if (customertype === "Mitra") {
        $('.type-usaha-mitra').show()
        $('.type-usaha-pelanggan').hide()
    } else if (customertype === "Pelanggan dan Mitra") {
        $('.type-usaha-mitra').show()
        $('.type-usaha-pelanggan').show()
    }

    //usaha pelanggan bullet mandatory
    let usahaPelanggan = $('select[id="usaha_pelanggan"]').val();
    const id_cargo_owner = 'fd28cc6b-3c3c-45c6-be0b-85ecb4afda8f';
    const id_shippingline = 'a6c0f05a-b458-43e5-9f4c-eb594d7ee68e';
    const double = [id_cargo_owner, id_shippingline ]; 
    const included = double.filter(type => usahaPelanggan.includes(type));
    if(included == id_cargo_owner){
      $('.type-cargo').show()
      $('.type-shippingline').hide()
    }else if (included == id_shippingline) {
        $('.type-cargo').hide()
        $('.type-shippingline').show()
    }else if (double.every(type => usahaPelanggan.includes(type))){
        $('.type-cargo').show()
        $('.type-shippingline').show()
    }

    //hide cor & DGT from county
    let countryName = $('#country option:checked').text();
    if(countryName != 'Indonesia') {
      $('.cor-bullet').show()
    } else {
      $('.cor-bullet').hide()
    }

    //hide button draft on stepper one
    $('#draf').hide()

    //hide & show button principle field
    let bentukUsaha = $('#bentuk_usaha').find(':selected').text();
    bentukUsaha == 'BUT' ? $('#principle-form').show() : '';
  
    //npwp formater
    let npwpNumber = $('#npwp_number').val()
    let formaterVal = npwpNumber.replace(/\D/g, "");
    formaterVal = formaterVal.substring(0, 15); 
    formaterVal = formaterVal.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})$/, "$1.$2.$3.$4-$5");
    $('#npwp_number').val(formaterVal)
  
    // validation select customer type
    $('select[name="id_customer_type"]').change(function(){
        
      var types = $(this).find('option:selected').text()
      var pelanggan = $('select[name="id_customer[]"]')
      var mitra = $('select[name="id_mitra[]"]')
      var shipping_line = $('select[name="id_shipping_line[]"]')
      var cargo_owner = $('select[name="id_cargo_owner[]"]')
      console.log(types)
      if(types === "Pelanggan"){
          pelanggan.attr('disabled',false)
          shipping_line.attr('disabled',false)
          cargo_owner.attr('disabled',false)
          mitra.attr('disabled',true)
          mitra.find('option').remove().end()
          mitra.prepend(`
          @each(data in mitra)
          <option value="{{data.id}}">{{data.name}}</option>
          @endeach
          `)
      } else if (types === "Mitra") {
          mitra.attr('disabled',false);
          pelanggan.attr('disabled',true);
          shipping_line.attr('disabled',true);
          cargo_owner.attr('disabled',true);
          pelanggan.find('option').remove().end();
          shipping_line.find('option').remove().end();
          cargo_owner.find('option').remove().end();
          pelanggan.prepend(`
          @each(data in customer)
          <option value="{{data.id}}">{{data.name}}</option>
          @endeach
          `);
          shipping_line.prepend(`
          @each(data in shipping_line)
          <option value="{{data.id}}">{{data.name}}</option>
          @endeach
          `);
          cargo_owner.prepend(`
          @each(data in cargo_owner)
          <option value="{{data.id}}">{{data.name}}</option>
          @endeach
          `)
      } else if (types === "Pelanggan dan Mitra") {
          pelanggan.attr('disabled',false)
          mitra.attr('disabled',false)
      } else {
          pelanggan.attr('disabled',true)
          mitra.attr('disabled',true)
          mitra.find('option').remove()
          pelanggan.find('option').remove() 
          pelanggan.prepend(`
          @each(data in customer)
          <option value="{{data.id}}">{{data.name}}</option>
          @endeach
          `);
          mitra.prepend(`
          @each(data in mitra)
          <option value="{{data.id}}">{{data.name}}</option>
          @endeach
          `);       
      }
    })
  
  
  
    // standarisasi uppercase
    // $(":text").keyup(function() {
    //   const teksUp = String($(this).val()).toUpperCase();
    //   $(this).val(teksUp);
    // });
  
    //batal
    $('#batal').click(function() {
      window.location.assign(`/master-customer`);
    });
  
    var carouselVal = 0;
    // kembali
    $("#kembali").click(function() {
      if(carouselVal === 1) {
        carouselVal -= 1
        $("#carouselCustomer").carousel(0); 
        $(this).css('display', 'none');
      } else if (carouselVal === 2) {
        carouselVal -= 1
        $("#carouselCustomer").carousel(1); 
        $("#selanjutnya").css('display', '');
      } else if (carouselVal === 3) {
        carouselVal -= 1
        $("#carouselCustomer").carousel(2);
        $("#selanjutnya").css('display', '');
      } else if (carouselVal === 4) {
        carouselVal -= 1
        $("#carouselCustomer").carousel(3); 
        $("#selanjutnya").css('display', '');
      }
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
          // draftValidation()
          if (isErrors === false) {
            postData('DRAFT')
          } else {
          }
        }
      });
    });
  
    //NPWP select
    let npwpType = $('#npwp-type').val();
    if (npwpType == '1') { 
      $('#npwp_number').keyup(function() {
        var npwp = $('#npwp_number')
        let formaterVal = npwp.val().replace(/\D/g, "");
        formaterVal = formaterVal.substring(0, 15); 
        formaterVal = formaterVal.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})$/, "$1.$2.$3.$4-$5");
        $(this).val(formaterVal)
      })
    }
    $('#npwp-type').change(function() {
      npwpType = $('#npwp-type').val();
      if (npwpType == '1') { 
        $('#npwp_number').keyup(function() {
          var npwp = $('#npwp_number')
          let formaterVal = npwp.val().replace(/\D/g, "");
          formaterVal = formaterVal.substring(0, 15); 
          formaterVal = formaterVal.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})$/, "$1.$2.$3.$4-$5");
          $(this).val(formaterVal)
        })
      } else if (npwpType != '' && npwpType != '1') {
        $('#npwp_number').keyup(function() {
          let inputValue = $(this).val()
          let numericValue = inputValue.replace(/\D/g, "");
          $(this).val(numericValue)
        })
      } else if (npwpType == '') {
        $('#npwp_number').keyup(function() {
          return Swal.fire({
            html: `Pilih Format NPWP/NIK/TAX ID`,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: {
                confirmButton: "btn btn-primary",
            }          
        })
        })
      }
    })
  
     // get value parent company
     $('#parent_company').select2({
        placeholder: "Select parent company",
        allowClear: true,
        ajax: {
            url: "{{route('select2.parentCompany')}}",
            dataType: 'json',
            type: "GET",
            data: function (params) {
                var query = {
                search: params.term,
                }
                // Query parameters will be ?search=[term]&page=[page]
                return query;
            },
            processResults: function(data){
                console.log(data)
                return  {
                    results: $.map(data,function(item){
                        return{
                            text: item?.company_name,
                            id: item?.company_name
                        }
                    })
                }
            }
        }
    });
  
    //validation
    var isErrors = false
    // next
    $("#selanjutnya").click(function() {
      var isError = false;
      if(carouselVal === 0) {
      //   validationGeneralInfo()
          if (isErrors === false) {
              $('#draf').show()
              carouselVal += 1;
              $("#carouselCustomer").carousel(1); 
              $("#kembali").css('display', 'block');
          } else {
          }
      } else if(carouselVal === 1) {
      //   validationSpesifik()
          if (isErrors === false) {
              $('#draf').show()
              carouselVal += 1;
              $("#carouselCustomer").carousel(2); 
          } else {}
      } else if(carouselVal === 2) {
          if(isErrors === false) {
              $('#draf').show()
              carouselVal += 1;
              $("#carouselCustomer").carousel(3); 
          } else {}
        } else if(carouselVal === 3) {
          if(isErrors === false) {
              $('#draf').show()
              carouselVal += 1;
              $("#carouselCustomer").carousel(4); 
              $(this).css('display', 'none');
          } else {}
        }
    });
  
    //stepper button
    $("#ball-step-1").click(function() {
      $('#draf').hide()
        carouselVal = 0
        $("#carouselCustomer").carousel(0);
        $('#kembali').css('display', 'none');
        $("#selanjutnya").css('display', '');
    })
  
    $("#ball-step-2").click(function() {
      // validationGeneralInfo()
      if(isErrors === false) {
        $('#draf').show()
        carouselVal = 1
        $("#carouselCustomer").carousel(1); 
        $("#kembali").css('display', 'block');
        $("#selanjutnya").css('display', '');
      }
    })
  
    $("#ball-step-3").click(function() {
      // validationSpesifik()
      if(isErrors === false) {
        $('#draf').show()
        carouselVal = 2
        $("#carouselCustomer").carousel(2); 
        $('#selanjutnya').css('display', 'block');
        $("#kembali").css('display', 'block');
      }
    })
  
    $("#ball-step-4").click(function() {
      // validationSpesifik()
      if(isErrors === false) {
        $('#draf').show()
        carouselVal = 3
        $("#carouselCustomer").carousel(3); 
        $('#selanjutnya').css('display', 'block');
        $("#kembali").css('display', 'block');
      }
    })
  
    $("#ball-step-5").click(function() {
      // validationSpesifik()
      if(isErrors === false) {
        $('#draf').show()
        carouselVal = 4
        $("#carouselCustomer").carousel(4); 
        $('#selanjutnya').css('display', 'none');
        $("#kembali").css('display', 'block');
      }
    })
    
    // ketika tombol kirim ditekan
    $('#kirim').click(function() {
      // validationDocument()
      if(isErrors === false) {
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
              // var isError = false;
              postData('REQUEST')
            }
          });
      } else {
      }
    });
  
    function progressUpload(element,name,percentage){
      var progress = `
      <div class="uploadProgress-${name} progress my-2" style="height: 10px;">
          <div class="progress-bar bg-primary text-white" role="progressbar" style="width: ${percentage}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${percentage}%</div>
      </div>
      `
      $(element).after(progress)
  }
  
  //upload file
  uploadFile("spmp");
  uploadFile("ktp_pemimpin_perusahaan");
  uploadFile("ket_domisili");
  uploadFile("ktp_pic");
  uploadFile("siupal_siupkk");
  uploadFile("pmku");
  uploadFile("siup_nib");
  uploadFile("akta_perusahaan");
  uploadFile("reff_bank");
  uploadFile("siupbm");
  uploadFile("npwp_upload");
  uploadFile("pkp_non_pkp");
  uploadFile("rek_asosiasi");
  uploadFile("sktd");
  uploadFile("cor_dgt");
  uploadFile("surat_pengelolaan");
  uploadFile("skpt");
  uploadFile("siopsus");
  });
  
  function progressUpload(element,name,percentage){
      var progress = `
      <div class="uploadProgress-${name} progress my-2" style="height: 10px;">
          <div class="progress-bar bg-primary text-white" role="progressbar" style="width: ${percentage}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${percentage}%</div>
      </div>
      `
      $(element).after(progress)
  }
  
  function uploadFile (fieldname){
      // start SPMP
      $(`#${fieldname}`).change(function(){
          var file_data = $(`#${fieldname}`).prop('files')[0];
          var field_input = $(`#${fieldname}`).attr('name');
          var form_data = new FormData();
          form_data.append('inputFile',file_data);
          form_data.append('fieldInput',field_input);
  
          if(file_data.name.includes("pdf") == false) {
            $(`#${fieldname}`).val("")
            $(`input[name="${fieldname}_file"]`).val("")
            return Swal.fire({
                      html: `File yang dipilih harus PDF`,
                      icon: "error",
                      buttonsStyling: false,
                      confirmButtonText: "Ok",
                      customClass: {
                          confirmButton: "btn btn-primary",
                      }          
                  })
          }
            $.ajax({
                url:"/customer/uploadFile",
                type:"post",
                data: form_data,
                contentType: false,
                cache: false,
                processData:false,
                timeout: 20000,
                xhr: function() {
                    var xhr = $.ajaxSettings.xhr();
                    xhr.upload.onprogress = function(e) {
                        var percentage = Math.floor(e.loaded / e.total *100);
                        $('div').remove(`.uploadProgress-${fieldname}`);
                        progressUpload(`#${fieldname}`,`${fieldname}`,percentage)
                    };
                    return xhr;
                },
                success: function (data) {
                    $(`#${fieldname}`).css('border-color', '#045299');
                    $(`#${fieldname}`).css('color', '#045299');
                    // $('div').remove('.uploadProgress');
                    $(`input[name="${fieldname}_file"]`).val(data == undefined ? "" : data)
                  },
                  error: function (error) {
                    $(`input[name="${fieldname}_file"]`).val("")
                    $(`#${fieldname}`).css('border-color', '#045299');
                    $(`#${fieldname}`).css('color', '#045299');
                    if(error.statusText == "Request Entity Too Large"){
                        Swal.fire({
                            html: `File yang dipilih lebih dari 2 MB`,
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok",
                            customClass: {
                                confirmButton: "btn btn-primary",
                            }          
                        })
                    } else {
                      $(`input[name="${fieldname}_file"]`).val("")
                        Swal.fire({
                            html: `${error.statusText}`,
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok",
                            customClass: {
                                confirmButton: "btn btn-primary",
                            }          
                        })
                    }
                }
            })
      })
  }
    
    function postData(status) {
      // return console.log(dateFormater($("input[name='exp_ket_domisili']").val()));
      let id = $('#data-id').val()
      $.ajax({
        url: `/master-customer/updateData/${id}`,
        type: 'get',
        beforeSend: function() {
        blockUI.block();
        },
        data: {
          status: status,
          'nm_perusahaan' : $('#company_name').val() ? $('#company_name').val() : '',
          'email' : $('#customer_email').val() ? $('#customer_email').val() : '',
          'phone' : $('#phone').val() ? $('#phone').val() : '',
          'address' : $('#customer_address').val() ? $('#customer_address').val() : '',
          'nm_pemimpin' : $('#company_head').val() ? $('#company_head').val() : '',
          'parent_customer' : $('#parent_company').val() ? $('#parent_company').val() : '',
          'join_date' : $('#joining_since').val() ? $('#joining_since').val() : '',
          'establish_date' : $('#company_est').val() ? $('#company_est').val() : '',
          'birthday_date' : $('#company_birthday').val() ? $('#company_birthday').val() : '',
          'birthday_pemimpin_date' : $('#company_head_birthday').val() ? $('#company_head_birthday').val() : '',
          'group_customer_id' : $('#customer_group').val() ? $('#customer_group').val() : '',
          'bentuk_usaha_id' : $('#bentuk_usaha').val() ? $('#bentuk_usaha').val() : '',
          'country_id' : $('#country').val() ? $('#country').val() : '',
          'area_id' : $('#id_postal_code').val() ? $('#id_postal_code').val() : '',
          'is_bebas_pajak' : $('input[name=bebas_pajak]:checked').val() ? $('input[name=bebas_pajak]:checked').val() : '',
          'tp_company' : $('input[name=parent]:checked').val() ? $('input[name=parent]:checked').val() : '',
          'tp_nm_perusahaan' : nameType(),
          'no_pmku' : $('#pmku_number').val() ? $('#pmku_number').val() : '',
          'no_sktd' : $('#no_sktd').val() ? $('#no_sktd').val() : '',
          'usaha_pelanggan' : typeUsahaPelanggan(),
          'mitra' : typeUsahaMitra(),
          'shipping_line' : typeShippingLine(),
          'cargo_owner' : cargoOwner(),
          'service_type' : serviceType(),
          'branch_id' : $('#first_registration_branch').val(),
          'customer_type_id' : $('#customer_type').val(),
          //additional update
          'no_affiliasi' : $('#no_affiliasi').val(),
          'no_customer' : $('#no_customer').val(),
          //other table
          'npwp' : npwp(),
          'contact' : contact(),
          'billing' : billing(),
          'document' : documentFile(),
          // 'exp_document' : expDocument(),
          'payment_type' : paymentType(),
          //exp document
          'exp_ket_domisili' : $("input[name='exp_ket_domisili']").val() ? $("input[name='exp_ket_domisili']").val() : '',
          'exp_siupal_siupkk' : $("input[name='exp_siupal_siupkk']").val() ? $("input[name='exp_siupal_siupkk']").val() : '',
          'exp_siupbm' : $("input[name='exp_siupbm']").val() ? $("input[name='exp_siupbm']").val() : '',
          'exp_siup_nib' : $("input[name='exp_siup_nib']").val() ? $("input[name='exp_siup_nib']").val() : '',
          'exp_sktd' : $("input[name='exp_sktd']").val() ? $("input[name='exp_sktd']").val() : '',
          'exp_cor_dgt' : $("input[name='exp_cor_dgt']").val() ? $("input[name='exp_cor_dgt']").val() : '',
          'exp_surat_izin_pengelolaan' : $("input[name='exp_surat_pengelolaan']").val() ? $("input[name='exp_surat_pengelolaan']").val() : '',
          'exp_skpt' : $("input[name='exp_skpt']").val() ? $("input[name='exp_skpt']").val() : '',
          'exp_siopsus' : $("input[name='exp_siopsus']").val() ? $("input[name='exp_siopsus']").val()  : ''
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
              window.location.assign(`{{ route('MasterCustomerV2Controller.index') }}`);
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
    }
  
    function nameType(){
      var name = [];
      $("input[name='type-nama-perusahaan']:checked").each(function() {
          name.push($(this).val());
      });
      
      if (name.length == 2) {
        return 3
      } else {
        return name[0]
      }
    }
  
    function serviceType() {
      var service = [];
      $("input[name='id_service_type[]']:checked").each(function() {
        service.push($(this).val());
      });
  
      return service.map(el => {
        return {
          service_type_id : el
        }
      })
    }
  
    function npwp() {
      let noNpwp = $('#npwp_number').val().replace(/[.-]/g, "");
      return {
        'no_npwp' : $('#npwp_number').val() ? noNpwp : '',
        'name' : $('#npwp_name').val() ? $('#npwp_name').val() : '',
        'address' : $('#npwp_address').val() ? $('#npwp_address').val() : '',
        'type' : $('#npwp-type').val() ? $('#npwp-type').val() : ''
      }
    }
  
    function contact() {
      let dataContact = []
      let contactName =  Array.from(document.querySelectorAll("input[name='contact_name[]']"), input => input.value);
      let location = Array.from(document.querySelectorAll("select[name='contact_branch_id[]'"), input => input.value);
      let email = Array.from(document.querySelectorAll(".email_contact"), input => input.value);
      let jobPosition = Array.from(document.querySelectorAll(".position"), input => input.value);
      let mobile = Array.from(document.querySelectorAll(".mobile"), input => input.value);
      let phone = Array.from(document.querySelectorAll(".contact_phone"), input => input.value);
      let address = Array.from(document.querySelectorAll(".contact_address"), input => input.value);
      contactName.forEach((val, index) => {
        dataContact.push(
          {
            'nm_contact' : val,
            'email_contact' : email[index],
            'job_title' : jobPosition[index],
            'mobilephone' : mobile[index],
            'phone' : phone[index],
            'address' : address[index],
            'location_id' : location[index],
          }
        )
      });
      return dataContact
    }
  
    function paymentType() {
      let paymentType = []
      let payment = Array.from(document.querySelectorAll('select[name="id_payment_type[]"] option:checked')).map(el => ({payment_types_id : el.value}));
      paymentType.push(payment)
  
      return paymentType
    }
  
    function billing() {
      let billingData = []
      let namaAccount = Array.from(document.querySelectorAll(".billing_name"), input => input.value);
      let noBank = Array.from(document.querySelectorAll(".bank_number"), input => input.value);
      let namaBank = Array.from(document.querySelectorAll(".bank_name"), input => input.value);
      let noNpwp = Array.from(document.querySelectorAll(".billing_npwp"), input => input.value);
      // let payment = Array.from(document.querySelectorAll("select[name='id_payment_type[]'"), input => input.value)
      namaAccount.forEach((val, index) => {
        billingData.push({
          'nm_account' : val,
          'no_bank_account' : noBank[index],
          'nm_bank' : namaBank[index],
          'no_npwp' : noNpwp[index].replace(/[.-]/g, "")
        })
      })
      return billingData
    }
  
    function documentFile() {
      return {
        'spmp' : $("input[name='spmp_file']").val(),
        'ket_domisili' : $("input[name='ket_domisili_file']").val(),
        'ktp_pemimpin_perusahaan' : $("input[name='ktp_pic_file']").val(),
        'ktp_pic' : $("input[name='ktp_pic_file']").val(),
        'siupal_siupkk' : $("input[name='siupal_siupkk_file']").val(),
        'siupbm' : $("input[name='siupbm_file']").val(),
        'siup_nib' : $("input[name='siup_nib_file']").val(),
        'akta_perusahaan' : $("input[name='akta_perusahaan_file']").val(),
        'ref_bank' : $("input[name='reff_bank_file']").val(),
        'npwp' : $("input[name='npwp_upload_file']").val(),
        'pkp_non_pkp' : $("input[name='pkp_non_pkp_file']").val(),
        'rek_asosiasi' : $("input[name='rek_asosiasi_file']").val(),
        'sktd' : $("input[name='sktd_file']").val(),
        'cor_dgt' : $("input[name='cor_dgt_file']").val(),
        'surat_izin_pengelolaan' : $("input[name='surat_pengelolaan_file']").val(),
        'skpt' : $("input[name='skpt_file']").val(),
        'siopsus' : $("input[name='siopsus_file']").val(),
        'pmku' : $("input[name='pmku_file']").val()
      }
    }
  
    // function expDocument() {
    //   return {
    //     'exp_ket_domisili' : $("input[name='exp_ket_domisili']").val() ? dateFormater($("input[name='exp_ket_domisili']").val()) : '',
    //     'exp_siupal_siupkk' : $("input[name='exp_siupal_siupkk']").val() ? dateFormater($("input[name='exp_siupal_siupkk']").val()) : '',
    //     'exp_siupbm' : $("input[name='exp_siupbm']").val() ? dateFormater($("input[name='exp_siupbm']").val()) : '',
    //     'exp_siup_nib' : $("input[name='exp_siup_nib']").val() ? dateFormater($("input[name='exp_siup_nib']").val()) : '',
    //     'exp_sktd' : $("input[name='exp_sktd']").val() ? dateFormater($("input[name='exp_sktd']").val()) : '',
    //     'exp_cor_dgt' : $("input[name='exp_cor_dgt']").val() ? dateFormater($("input[name='exp_cor_dgt']").val()) : '',
    //     'exp_surat_izin_pengelolaan' : $("input[name='exp_surat_pengelolaan']").val() ? dateFormater($("input[name='exp_surat_pengelolaan']").val()) : '',
    //     'exp_skpt' : $("input[name='exp_skpt']").val() ? dateFormater($("input[name='exp_skpt']").val()) : '',
    //     'exp_siopsus' : $("input[name='exp_siopsus']").val() ? dateFormater($("input[name='exp_siopsus']").val())  : ''
    //   }
    // }
  
    //mapping input multiselect
    function typeUsahaPelanggan() {
      let typeUsaha = $('#usaha_pelanggan').val()
      return typeUsaha.map(el => {
        return {
          usaha_pelanggan_id : el
        }
      })
    }
  
    function typeUsahaMitra() {
      let typeUsaha = $('#mitra').val()
      return typeUsaha.map(el => {
        return {
          mitra_id : el
        }
      })
    }
  
    function typeShippingLine() {
      let shippingLine = $('#shippingline').val()
      return shippingLine.map(el => {
        return {
          shipping_line_id : el
        }
      })
    }
  
    function cargoOwner() {
      let owner = $('#id_cargo_owner').val()
      return owner.map(el => {
        return {
          cargo_owner_id : el
        }
      })
    }
  
    // function dateFormater(inputDate) {
    //   let date = new Date(inputDate);
  
    //   let options = {
    //     year: 'numeric',
    //     month: 'numeric',
    //     day: 'numeric',
    //     hour: 'numeric',
    //     minute: 'numeric',
    //     second: 'numeric',
    //     hour12: false,
    //     timeZone: 'UTC'
    //   };
  
    //   let formattedDate = date.toLocaleString('id-ID', options);
  
    //   return formattedDate
    // }
  
    // remove form contact
    $(document).on('click','.remove-contact',function(e){
      e.preventDefault()
      let row_item = $(this).parent().parent().parent().parent()
      $(row_item).remove()
    })
    // remove form billing
    $(document).on('click','.remove-billing',function(e){
        e.preventDefault()
        let row_item = $(this).parent().parent().parent().parent()
        $(row_item).remove()
    })
  
  
  
  
  