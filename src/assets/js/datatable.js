$(document).ready(function() {
    $('#usertable').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            {
                extend:    'copy',
                text:      '<i class="fa fa-files-o"></i> Copy',
                titleAttr: 'Copy'
            },
            {
                extend:    'print',
                text:      '<i class="fa fa-print" aria-hidden="true"></i> Print',
                titleAttr: 'Print'
            },
            {
                extend:    'excel',
                text:      '<i class="fa fa-file-text-o"></i> Excel',
                titleAttr: 'Excel'
            },
            {
                extend:    'pdf',
                text:      '<i class="fa fa-file-pdf-o"></i> PDF',
                titleAttr: 'Pdf'
            },
            {
                extend: 'colvis',
                text: '<i class="fa fa-filter" i18n></i> Filters',
                titleAtrr: 'Filters'
            }
        ]
    } );
} );

