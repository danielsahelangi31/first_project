    //validation
    var isError = false

    // validation npwp
    var npwpCheck = false;
    $(document).on('change', '#npwp_number', function(){
        npwpCheck = true;
    })

    $('.npwp_check').click(function() {
      npwpCheck = false;
    })

    
    function validationNpwp () {
      let error = {
          number: false,
          name: false,
          address: false,
          npwp_check : npwpCheck
      }

      let npwp_types = $('#npwp-type').val()
      if(npwp_types == '1' && npwpCheck == true) {
        Swal.fire({
          html: `Check Terlebih Dahulu Nomor NPWP`,
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          customClass: {
              confirmButton: "btn btn-primary",
          }  
        })
      }


      $('#npwp_number').each(function(){
          if($("#npwp_number").val() == ''){
              error.number = true;
              if($("#npwp_number").hasClass("is-invalid") == false) {
                  $("#npwp_number").addClass("is-invalid");
                  var text = $("<div></div>").text("Lengkapi bidang ini");
                  text.addClass("invalid-feedback");
                  text.attr('id', 'npwp_number-class-description');
                  $("#npwp_number").next().after(text);
              }
          } else {
              error.number = false;
              $(".npwp_number").removeClass('is-invalid');
              $('#npwp_number-class-description').remove();
          }
      })

      if($("#npwp_name").val() == ''){
          error.name = true;
          if($("#npwp_name").hasClass("is-invalid") == false) {
              $("#npwp_name").addClass("is-invalid");
              var text = $("<div></div>").text("Lengkapi bidang ini");
              text.addClass("invalid-feedback");
              text.attr('id', 'npwp_name-class-description');
              $("#npwp_name").after(text);
          }
      } else {
          error.name = false;
          $("#npwp_name").removeClass('is-invalid');
          $('#npwp_name-class-description').remove();
      }

      if($("#npwp_address").val() == ''){
          error.address = true;
          if($("#npwp_address").hasClass("is-invalid") == false) {
              $("#npwp_address").addClass("is-invalid");
              var text = $("<div></div>").text("Lengkapi bidang ini");
              text.addClass("invalid-feedback");
              text.attr('id', 'npwp_address-class-description');
              $("#npwp_address").after(text);
          }
      }else {
          error.address = false;
          $("#npwp_address").removeClass('is-invalid');
          $('#npwp_address-class-description').remove();
      }

      if(error.number == false && error.name == false && error.address == false && error.npwp_check == false){
          isError = false
      } else {
          isError = true
      }

    }

    function validationCustomerInfo () {
        let error = {
            name: false,
            email: false,
            address: false,
            customerType: false,
            customerGroup: false,
            bentukUsaha: false,
            parentRadio: false,
            parentCompany: false

        }

        if($("#company_name").val() == ''){
            error.name = true;
            if($("#company_name").hasClass("is-invalid") == false) {
                $("#company_name").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'company_name-class-description');
                $("#company_name").after(text);
                $("#company_name").focus();
            }
        } else {
            error.name = false;
            $("#company_name").removeClass('is-invalid');
            $('#company_name-class-description').remove();
        }
    

        if($("#customer_email").val() == ''){
            error.email = true;
            if($("#customer_email").hasClass("is-invalid") == false) {
                $("#customer_email").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'customer_email-class-description');
                $("#customer_email").after(text);
                $("#customer_email").focus();
            }
        } else {
            error.email = false;
            $("#customer_email").removeClass('is-invalid');
            $('#customer_email-class-description').remove();
        }
    
        if($("#customer_type").val() == ''){
            error.customerType = true;
            if($("#customer_type").hasClass("is-invalid") == false) {
                $("#customer_type").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'customer_type-class-description');
                $("#customer_type").after(text);
                $("#customer_type").focus();
            }
        } else {
            error.customerType = false;
            $("#customer_type").removeClass('is-invalid');
            $('#customer_type-class-description').remove();
        }
    
        if($("#customer_group").val() == ''){
            error.customerGroup = true;
            if($("#customer_group").hasClass("is-invalid") == false) {
                $("#customer_group").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'customer_group-class-description');
                $("#customer_group").after(text);
                $("#customer_group").focus();
            }
        } else {
            error.customerGroup = false;
            $("#customer_group").removeClass('is-invalid');
            $('#customer_group-class-description').remove();
        }
        if($("#customer_address").val() == ''){
            error.address = true;
            if($("#customer_address").hasClass("is-invalid") == false) {
                $("#customer_address").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'customer_address-class-description');
                $("#customer_address").after(text);
                $("#customer_address").focus();
            }
        } else {
            error.address = false;
            $("#customer_address").removeClass('is-invalid');
            $('#customer_address-class-description').remove();
        }
    
        if($("#bentuk_usaha").val() == ''){
            error.bentukUsaha = true;
            if($("#bentuk_usaha").hasClass("is-invalid") == false) {
                $("#bentuk_usaha").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'bentuk_usaha-class-description');
                $("#bentuk_usaha").after(text);
                $("#bentuk_usaha").focus();
            }
        } else {
            error.bentukUsaha = false;
            $("#bentuk_usaha").removeClass('is-invalid');
            $('#bentuk_usaha-class-description').remove();
        }

    
        let radios = $(".parent-radio")
        if(!radios.is(':checked')){
            error.parentRadio = true;
            $(radios).addClass("is-invalid");
            var text = $("<div></div>").text("Lengkapi bidang ini");
            text.addClass("invalid-feedback");
            text.attr('id', 'parent-radio-class-description');
            $(radios).after(text);
            $(radios).focus();
        }else{
            error.parentRadio = false;
            $(radios).removeClass('is-invalid');
            $('#parent-radio-class-description').remove();
        }
    
        let data = $('input[id="parent-radio-2"]').is(':checked')
        if(data){
            if($("#parent_company_data").val() == ''){
            error.parentCompany = true;
            if($("#parent_company_data").hasClass("is-invalid") == false) {
                $("#parent_company_data").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'parent_company_data-class-description');
                $("#parent_company_data").after(text);
                $("#parent_company_data").focus();
            }
            } else {
                error.parentCompany = false;
                $("#parent_company_data").removeClass('is-invalid');
                $('#parent_company_data-class-description').remove();
            }
        }; 

        if(error.name == false && error.email == false && error.address == false && error.customerType == false
            && error.customerGroup == false && error.bentukUsaha == false && error.parentRadio == false && error.parentCompany == false
        ) {
            isError = false 
        } else {
            isError = true
        }
        
    }


    function validationContact() {
        let error = {
            name: [],
            email: [],
            address: [],
            position: [],
            mobile: []
        }

        $('.contact_name').each(function(val, index){
          // let index = $('.contact_name').index(this)
            let data = $(this).val()
            if(data == ''){
            error.name.push(true);
            if($(this).hasClass("is-invalid") == false) {
                $(this).addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'contact_name-class-description');
                $(this).after(text);
            }
            } else {
                error.name.push(false);
                $(this).removeClass('is-invalid');
                $('#contact_name-class-description').remove();
            }
          })

        $('.email_contact').each(function(){
            let data = $(this).val()
            if(data == ''){
            error.email.push(true);
            if($(this).hasClass("is-invalid") == false) {
                $(this).addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'invalid-class-description');
                $(this).after(text);
            }
            } else {
                error.email.push(false);
                $(this).removeClass('is-invalid');
                $('#invalid-class-description').remove();
            }
        })

        $('.position').each(function(){
            let data = $(this).val()
            if(data == ''){
            error.position.push(true);
            if($(this).hasClass("is-invalid") == false) {
                $(this).addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'invalid-class-description');
                $(this).after(text);
            }
            } else {
                error.position.push(false);
                $(this).removeClass('is-invalid');
                $('#invalid-class-description').remove();
            }
        })

        $('.contact_address').each(function(){
            let data = $(this).val()
            if(data == ''){
            error.address.push(true);
            if($(this).hasClass("is-invalid") == false) {
                $(this).addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'invalid-class-description');
                $(this).after(text);
            }
            } else {
                error.address.push(false);
                $(this).removeClass('is-invalid');
                $('#invalid-class-description').remove();
            }
        })

        $('.mobile').each(function(){
            let data = $(this).val()
            if(data == ''){
                error.mobile.push(true);
                if($(this).hasClass("is-invalid") == false) {
                    $(this).addClass("is-invalid");
                    var text = $("<div></div>").text("Lengkapi bidang ini");
                    text.addClass("invalid-feedback");
                    text.attr('id', 'invalid-class-description');
                    $(this).after(text);
                }
            } else {
                error.mobile.push(false);
                $(this).removeClass('is-invalid');
                $('#invalid-class-description').remove();
            }
        })

        if ( error.name.includes(true) == false && error.email.includes(true) == false && error.position.includes(true) == false && error.address.includes(true) == false
        && error.mobile.includes(true) == false) {
          isError = false;
        } else {
          isError = true;
        }

    }

    function validationBilling() {
        let error = {
            // name: [],
            // bankNumber: [],
            // bankName: [],
            npwpNumber: [],
            address: []
        }

        // $('.billing_name').each(function(){
        //     let data = $(this).val() 
        //     if(data == ''){
        //     error.name.push(true);
        //     if($(this).hasClass("is-invalid") == false) {
        //         $(this).addClass("is-invalid");
        //         var text = $("<div></div>").text("Lengkapi bidang ini");
        //         text.addClass("invalid-feedback");
        //         text.attr('id', 'invalid-class-description');
        //         $(this).after(text);
        //     }
        //     } else {
        //         error.name.push(false);
        //         $(this).removeClass('is-invalid');
        //         $('#invalid-class-description').remove();
        //     }
        // })

        $('.flag_npwp_billing').each(function(index,el) { 
          let data = $(this).val();
          let element
          if(data == '0') {
            element = $("[name='billing_npwp_number[]']").eq(index);
            if(element.val() == '') {
              element.addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'npwp-number-class-description');
                element.next().after(text);
            } else {
              error.npwpNumber.push(false);
              element.removeClass('is-invalid');
              $('#npwp-number-class-description').remove();
            }
          } else {
            element = $(".billing_npwp_create").eq(index);
            if(element.val() == '') {
              element.addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'npwp-number-class-description');
                element.after(text);
            } else {
              error.npwpNumber.push(false);
              element.removeClass('is-invalid');
              $('#npwp-number-class-description').remove();
            }
          }
        })

        $('.npwp-account-address').each(function(){
            let data = $(this).val() 
            if(data == ''){
            error.address.push(true);
            if($(this).hasClass("is-invalid") == false) {
                $(this).addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'npwp-account-address-class-description');
                $(this).after(text);
            }
            } else {
                error.address.push(false);
                $(this).removeClass('is-invalid');
                $('#npwp-account-address-class-description').remove();
            }
        })

        // $('.bank_number').each(function(){
        //     let data = $(this).val()
        //     if(data == ''){
        //     error.bankNumber.push(true);
        //     if($(this).hasClass("is-invalid") == false) {
        //         $(this).addClass("is-invalid");
        //         var text = $("<div></div>").text("Lengkapi bidang ini");
        //         text.addClass("invalid-feedback");
        //         text.attr('id', 'invalid-class-description');
        //         $(this).after(text);
        //     }
        //     } else {
        //         error.bankNumber.push(false);
        //         $(this).removeClass('is-invalid');
        //         $('#invalid-class-description').remove();
        //     }
        // })

        // $("[name='bank_name[]']").each(function(index){
        //     let data = $(this).val()
        //     console.log(data, 'ini dari bank name');
        //     if(data == ''){
        //     error.bankName.push(true);
        //     if($(this).hasClass("is-invalid") == false) {
        //         $(this).addClass("is-invalid");
        //         var text = $("<div></div>").text("Lengkapi bidang ini");
        //         text.addClass("invalid-feedback");
        //         text.attr('id', 'bank_name-class-description');
        //         $(this).next().after(text);
        //     }
        //     } else {
        //         error.bankName.push(false);
        //         $(this).removeClass('is-invalid');
        //         $('bank_name-class-description').remove();
        //     }
        // })
        
        if(error.npwpNumber.includes(true) == false && error.address.includes(true) == false){
            isError = false
        } else {
            isError = true
        }
    }

    function validationDocument(){
      let error = {
        spmp : false,
        ktp_pemimpin : false,
        ktp_pic : false,
        ket_domisili : false,
        exp_ket_domisili : false,
        npwp_upload : false,
        cor_dgt : false,
        pmku : false,
        pmku_number : false,
        sktd : false,
        no_sktd : false,
        start_sktd : false,
        exp_sktd : false,
      }
  
        if($("#spmp_file").val() == ''){
            error.spmp = true;
            if($("#spmp").hasClass("is-invalid") == false) {
                $("#spmp").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'invalid-class-description');
                $("#spmp").after(text);
                $("#spmp").focus();
            }
        } else {
          error.spmp = false;
            $("#spmp").removeClass('is-invalid');
            $('#invalid-class-description').remove();
        }
  
        if($("#ktp_pemimpin_perusahaan_file").val() == ''){
            error.ktp_pemimpin = true;
            if($("#ktp_pemimpin_perusahaan").hasClass("is-invalid") == false) {
                $("#ktp_pemimpin_perusahaan").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'invalid-class-description');
                $("#ktp_pemimpin_perusahaan").after(text);
                $("#ktp_pemimpin_perusahaan").focus();
            }
        } else {
            error.ktp_pemimpin = false;
            $("#ktp_pemimpin_perusahaan").removeClass('is-invalid');
            $('#invalid-class-description').remove();
        }
  
        if($("#ktp_pic_file").val() == ''){
            error.ktp_pic = true;
            if($("#ktp_pic").hasClass("is-invalid") == false) {
                $("#ktp_pic").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'invalid-class-description');
                $("#ktp_pic").after(text);
                $("#ktp_pic").focus();
            }
        } else {
            error.ktp_pic = false;
            $("#ktp_pic").removeClass('is-invalid');
            $('#invalid-class-description').remove();
        }
  
        if($("#ket_domisili_file").val() == ''){
            error.ket_domisili = true;
            if($("#ket_domisili").hasClass("is-invalid") == false) {
                $("#ket_domisili").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'invalid-class-description');
                $("#ket_domisili").after(text);
                $("#ket_domisili").focus();
            }
        } else {
            error.ket_domisili = false;
            $("#ket_domisili").removeClass('is-invalid');
            $('#invalid-class-description').remove();
        }
  
        if($("#exp_ket_domisili").val() == ''){
            error.exp_ket_domisili = true;
            if($("#exp_ket_domisili").hasClass("is-invalid") == false) {
                $("#exp_ket_domisili").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'invalid-class-description');
                $("#exp_ket_domisili").after(text);
                $("#exp_ket_domisili").focus();
            }
        } else {
            error.exp_ket_domisili = false;
            $("#exp_ket_domisili").removeClass('is-invalid');
            $('#invalid-class-description').remove();
        }
  
        let npwp_types = $('#npwp-type').val()
        if(npwp_types == '1'){
            if($("#npwp_upload_file").val() == ''){
                error.npwp_upload = true;
                if($("#npwp_upload").hasClass("is-invalid") == false) {
                    $("#npwp_upload").addClass("is-invalid");
                    var text = $("<div></div>").text("Lengkapi bidang ini");
                    text.addClass("invalid-feedback");
                    text.attr('id', 'npwp_upload-class-description');
                    $("#npwp_upload").after(text);
                    $("#npwp_upload").focus();
                }
            } else {
                error.npwp_upload = false;
                $("#npwp_upload").removeClass('is-invalid');
                $('#npwp_upload-class-description').remove();
            }
        }
  
        let country = $('#country').find(':selected').text();
        if (country != 'Indonesia') {
            if($("#cor_dgt_file").val() == '' && country != 'Indonesia'){
                error.cor_dgt = true;
                if($("#cor_dgt").hasClass("is-invalid") == false) {
                    $("#cor_dgt").addClass("is-invalid");
                    var text = $("<div></div>").text("Lengkapi bidang ini");
                    text.addClass("invalid-feedback");
                    text.attr('id', 'cor_dgt-class-description');
                    $("#cor_dgt").after(text);
                    $("#cor_dgt").focus();
                }
            } else {
                error.cor_dgt = false;
                $("#cor_dgt").removeClass('is-invalid');
                $('#cor_dgt-class-description').remove();
            }
  
            if($("#exp_cor_dgt").val() == '' && country != 'Indonesia'){
              error.exp_cor_dgt = true;
              if($("#exp_cor_dgt").hasClass("is-invalid") == false) {
                  $("#exp_cor_dgt").addClass("is-invalid");
                  var text = $("<div></div>").text("Lengkapi bidang ini");
                  text.addClass("invalid-feedback");
                  text.attr('id', 'exp_cor_dgt-class-description');
                  $("#exp_cor_dgt").after(text);
                  $("#exp_cor_dgt").focus();
              }
            } else {
                error.exp_cor_dgt = false;
                $("#exp_cor_dgt").removeClass('is-invalid');
                $('#exp_cor_dgt-class-description').remove();
            }
        } 
  
        var bentukUsaha = $('#bentuk_usaha').find('option:selected').text();
  
        if (bentukUsaha == 'BUT') {
            if($("#cor_dgt_file").val() == '' && bentukUsaha == 'BUT'){
                error.cor_dgt = true;
                if($("#cor_dgt").hasClass("is-invalid") == false) {
                    $("#cor_dgt").addClass("is-invalid");
                    var text = $("<div></div>").text("Lengkapi bidang ini");
                    text.addClass("invalid-feedback");
                    text.attr('id', 'cor_dgt-class-description');
                    $("#cor_dgt").after(text);
                    $("#cor_dgt").focus();
                }
            } else {
                error.cor_dgt = false;
                $("#cor_dgt").removeClass('is-invalid');
                $('#cor_dgt-class-description').remove();
            }
  
            if($("#exp_cor_dgt").val() == '' && bentukUsaha == 'BUT'){
                error.exp_cor_dgt = true;
                if($("#exp_cor_dgt").hasClass("is-invalid") == false) {
                    $("#exp_cor_dgt").addClass("is-invalid");
                    var text = $("<div></div>").text("Lengkapi bidang ini");
                    text.addClass("invalid-feedback");
                    text.attr('id', 'exp_cor_dgt-class-description');
                    $("#exp_cor_dgt").after(text);
                    $("#exp_cor_dgt").focus();
                }
            } else {
                error.exp_cor_dgt = false;
                $("#exp_cor_dgt").removeClass('is-invalid');
                $('#exp_cor_dgt-class-description').remove();
            }
        }
  
        if (bentukUsaha == 'BUT') {
            if($("#pmku_file").val() == '' && bentukUsaha == 'BUT'){
                error.pmku = true;
                if($("#pmku").hasClass("is-invalid") == false) {
                    $("#pmku").addClass("is-invalid");
                    var text = $("<div></div>").text("Lengkapi bidang ini");
                    text.addClass("invalid-feedback");
                    text.attr('id', 'pmku-class-description');
                    $("#pmku").after(text);
                    $("#pmku").focus();
                }
            } else {
                error.pmku = false;
                $("#pmku").removeClass('is-invalid');
                $('#pmku-class-description').remove();
            }
        } 
  
        if (bentukUsaha == 'BUT') {
            if($("#pmku_number").val() == '' && bentukUsaha == 'BUT'){
                error.pmku_number = true;
                if($("#pmku_number").hasClass("is-invalid") == false) {
                    $("#pmku_number").addClass("is-invalid");
                    var text = $("<div></div>").text("Lengkapi bidang ini");
                    text.addClass("invalid-feedback");
                    text.attr('id', 'pmku_number-class-description');
                    $("#pmku_number").after(text);
                    $("#pmku_number").focus();
                }
            } else {
                error.pmku_number = false;
                $("#pmku_number").removeClass('is-invalid');
                $('#pmku_number-class-description').remove();
            }
        } 
  
        var isBebasPajak = $('input[name=bebas_pajak]:checked').val()
        if (isBebasPajak == '1') {
            if($("#sktd_file").val() == '' && isBebasPajak == '1'){
                error.sktd = true;
                if($("#sktd").hasClass("is-invalid") == false) {
                    $("#sktd").addClass("is-invalid");
                    var text = $("<div></div>").text("Lengkapi bidang ini");
                    text.addClass("invalid-feedback");
                    text.attr('id', 'sktd-class-description');
                    $("#sktd").after(text);
                    $("#sktd").focus();
                }
            } else {
                error.sktd = false;
                $("#sktd").removeClass('is-invalid');
                $('#sktd-class-description').remove();
            }
            
            if($("#no_sktd").val() == '' && isBebasPajak == '1'){
                error.no_sktd = true;
                if($("#no_sktd").hasClass("is-invalid") == false) {
                    $("#no_sktd").addClass("is-invalid");
                    var text = $("<div></div>").text("Lengkapi bidang ini");
                    text.addClass("invalid-feedback");
                    text.attr('id', 'no_sktd-class-description');
                    $("#no_sktd").after(text);
                    $("#no_sktd").focus();
                }
            } else {
                error.no_sktd = false;
                $("#no_sktd").removeClass('is-invalid');
                $('#no_sktd-class-description').remove();
            }
            
            if($("#start_sktd").val() == '' && isBebasPajak == '1'){
                error.start_sktd = true;
                if($("#start_sktd").hasClass("is-invalid") == false) {
                    $("#start_sktd").addClass("is-invalid");
                    var text = $("<div></div>").text("Lengkapi bidang ini");
                    text.addClass("invalid-feedback");
                    text.attr('id', 'start_sktd-class-description');
                    $("#start_sktd").after(text);
                    $("#start_sktd").focus();
                }
            } else {
                error.start_sktd = false;
                $("#start_sktd").removeClass('is-invalid');
                $('#start_sktd-class-description').remove();
            }
            
            if($("#exp_sktd").val() == '' && isBebasPajak == '1'){
                error.exp_sktd = true;
                if($("#exp_sktd").hasClass("is-invalid") == false) {
                    $("#exp_sktd").addClass("is-invalid");
                    var text = $("<div></div>").text("Lengkapi bidang ini");
                    text.addClass("invalid-feedback");
                    text.attr('id', 'exp_sktd-class-description');
                    $("#exp_sktd").after(text);
                    $("#exp_sktd").focus();
                }
            } else {
                error.exp_sktd = false;
                $("#exp_sktd").removeClass('is-invalid');
                $('#exp_sktd-class-description').remove();
            }
        } 
  
        if(error.spmp == false && error.ktp_pemimpin == false && error.ktp_pic == false && error.ket_domisili == false && error.exp_ket_domisili == false
          && error.npwp_upload == false && error.cor_dgt == false && error.pmku == false && error.pmku_number == false && error.sktd == false
          && error.no_sktd == false && error.start_sktd == false && error.exp_sktd == false
          ) {
            isError = false
          } else {
            isError = true
          }
    }

    function validationDraft () {
        let error = {
            name: false,
            parentRadio: false,
            parentCompany: false

        }

        if($("#company_name").val() == ''){
            error.name = true;
            if($("#company_name").hasClass("is-invalid") == false) {
                $("#company_name").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'invalid-class-description');
                $("#company_name").after(text);
                $("#company_name").focus();
            }
        } else {
            error.name = false;
            $("#company_name").removeClass('is-invalid');
            $('#invalid-class-description').remove();
        }
    
        let radios = $(".parent-radio")
        if(!radios.is(':checked')){
            error.parentRadio = true;
            $(radios).addClass("is-invalid");
            var text = $("<div></div>").text("Lengkapi bidang ini");
            text.addClass("invalid-feedback");
            text.attr('id', 'invalid-class-description');
            $(radios).after(text);
            $(radios).focus();
        }else{
            error.parentRadio = false;
            $(radios).removeClass('is-invalid');
            $('#invalid-class-description').remove();
        }
    
        let data = $('input[id="parent-radio-2"]').is(':checked')
        if(data){
            if($("#parent_company_data").val() == ''){
            error.parentCompany = true;
            if($("#parent_company_data").hasClass("is-invalid") == false) {
                $("#parent_company_data").addClass("is-invalid");
                var text = $("<div></div>").text("Lengkapi bidang ini");
                text.addClass("invalid-feedback");
                text.attr('id', 'invalid-class-description');
                $("#parent_company_data").after(text);
                $("#parent_company_data").focus();
            }
            } else {
                error.parentCompany = false;
                $("#parent_company_data").removeClass('is-invalid');
                $('#invalid-class-description').remove();
            }
        }; 

        if(error.name == false && error.parentRadio == false && error.parentCompany == false) {
            isError = false 
        } else {
            isError = true
        }
        
    }

