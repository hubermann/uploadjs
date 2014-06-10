<?php 
public function upload_ajax(){
//1 = OK - 0 = Failure
$file = array('status' => '', 'filename' => '', 'msg' => '' );
array('image/jpeg','image/pjpeg', 'image/jpg', 'image/png', 'image/gif','image/bmp');
//check extencion
/*
$file_extensions_allowed = array('application/pdf', 'application/msword', 'application/rtf', 'application/vnd.ms-excel','application/vnd.ms-powerpoint','application/zip','application/x-rar-compressed', 'text/plain');
$exts_humano = array('PDF', 'WORD', 'RTF', 'EXCEL', 'PowerPoint', 'ZIP', 'RAR');
*/
$file_extensions_allowed = array('image/jpeg','image/pjpeg', 'image/jpg', 'image/png', 'image/gif','image/bmp');
$exts_humano = array('JPG', 'JPEG', 'PNG', 'GIF');
$exts_humano = implode(', ',$exts_humano);
$ext = $_FILES['adjunto']['type'];
#$ext = strtolower($ext);
if(!in_array($ext, $file_extensions_allowed)){
	$exts = implode(', ',$file_extensions_allowed);
$file['msg'] .="file:".$_FILES['adjunto']['name']." <br /> Puede subir archivos que tengan alguna de estas extenciones: ".$exts_humano."";
}else{
	include(APPPATH.'libraries/class.upload.php');
	$yukle = new upload;
	$yukle->set_max_size(1900000);
	$yukle->set_directory('./images-comercios');
	$yukle->set_tmp_name($_FILES['adjunto']['tmp_name']);
	$yukle->set_file_size($_FILES['adjunto']['size']);
	$yukle->set_file_type($_FILES['adjunto']['type']);
	$random = substr(md5(rand()),0,6);
	$name_whitout_whitespaces = str_replace(" ","-",$_FILES['adjunto']['name']);
	$imagname=''.$random.'_'.$name_whitout_whitespaces;
	#$thumbname='tn_'.$imagname;
	$yukle->set_file_name($imagname);
	$yukle->start_copy();
	if($yukle->is_ok()){
	$yukle->resize(800,0);
	$yukle->set_thumbnail_name('tn_'.$random.'_'.$name_whitout_whitespaces);
	$yukle->create_thumbnail();
	$yukle->set_thumbnail_size(300, 0);
		//UPLOAD ok
		$file['filename'] = $imagname;
		$file['status'] = 1;
		$arr = array('status' => "OK", "archivo" => "".$imagname."");
		echo json_encode($arr);
		exit();
	}
	else{
		$arr = array('status' => "Error al subir archivo. ".$file['msg']."");
		echo json_encode($arr);
		exit();
	}
	//clean
	$yukle->set_tmp_name('');
	$yukle->set_file_size('');
	$yukle->set_file_type('');
	$imagname='';
}//fin if(extencion)
$arr = array('status' => "Error al subir archivo.");
echo json_encode($arr);
exit();
}
?>