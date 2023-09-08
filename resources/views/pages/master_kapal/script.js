$(document).ready(function() {
      
    // standarisasi uppercase
    $(":text").keyup(function() {
      const teksUp = String($(this).val()).toUpperCase();
      $(this).val(teksUp);
    });

    //batal
    $('#batal').click(function() {
      Swal.fire({
        title: "<span style='color:#FF0000;'>Batal?</span>", 
        html: "<strong>Apakah anda yakin ?</strong>",
        icon: 'error',
        showCancelButton: true, 
        cancelButtonText: "Tidak",
        confirmButtonText: "Iya",
        confirmButtonColor: "#045299",
        allowOutsideClick: false
      }).then((result)=>{
        if(result.isConfirmed == true) {
          window.location.assign(`{{ route('MasterVesselsController.index') }}`); 
        }
      });
    });

    var carouselVal = 0;
    // kembali
    $("#kembali").click(function() {
      if(carouselVal === 1) {
        //one step
        carouselVal -= 1
        $("#carouselKapal").carousel(0); 
        $('#ball-step-2').removeClass('btn-primary');
        $('#ball-step-2').addClass('btn-secondary');
        $('#teks-spesification').removeClass('text-primary');
        $('#teks-spesification').addClass('text-secondary');
        $('#progress-page').css('width', '0%');
        $(this).css('display', 'none');
      } else if (carouselVal === 2) {
        //two step
        carouselVal -= 1
        $("#carouselKapal").carousel(1); 
        $('#ball-step-3').removeClass('btn-primary');
        $('#ball-step-3').addClass('btn-secondary');
        $('#teks-spesification1').removeClass('text-primary');
        $('#teks-spesification1').addClass('text-secondary');
        $('#progress-page1').css('width', '0%');
        $('#kirim').css('display', 'none');
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
        allowOutsideClick: false
      }).then((result)=>{
        if(result.isConfirmed == true) {
          var isError = false;
        }
      });
    });

    // next
    $("#selanjutnya").click(function() {
      var isError = false;
      if(carouselVal === 0) {
        carouselVal += 1;
        $("#carouselKapal").carousel(1); 
        $('#ball-step-2').removeClass('btn-secondary');
        $('#ball-step-2').addClass('btn-primary');
        $('#teks-spesification').removeClass('text-secondary');
        $('#teks-spesification').addClass('text-primary');
        $('#progress-page').css('width', '100%');
        $("#kembali").css('display', 'block');
      } else if(carouselVal === 1) {
        carouselVal += 1;
        $("#carouselKapal").carousel(2); 
        $('#ball-step-3').removeClass('btn-secondary');
        $('#ball-step-3').addClass('btn-primary');
        $('#teks-spesification1').removeClass('text-secondary');
        $('#teks-spesification1').addClass('text-primary');
        $('#progress-page1').css('width', '100%');
        $('#kirim').css('display', 'block');
        $(this).css('display', 'none');
      }
    });
    
    // ketika tombol kirim ditekan
    $('#kirim').click(function() {
    Swal.fire({
        title: "<span style='color:#8CE02C;'>Dikirim</span>",
        html: '<strong>Apakah anda yakin ?</strong>', 
        icon: 'success',
        showCancelButton: true,
        cancelButtonText: "Tidak",
        confirmButtonText: 'Iya', 
        confirmButtonColor: '#045299', 
        allowOutsideClick: false
    }).then((result)=>{
        
        if(result.isConfirmed == true) {

          var isError = false;
          console.log(isError);
        }
      });
    });

    console.log('masuk script');
  });
