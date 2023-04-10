import Swal from "sweetalert2";

export const SwetAlertsucces = () => {
    return (  
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'ghello' ,
            showConfirmButton: false,
            timer: 1500
          })
    );
}
