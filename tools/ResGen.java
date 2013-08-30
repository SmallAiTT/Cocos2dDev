package com.tt.game;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;

public class ResGen {

	public static void main(String[] args) {
		ResGen gen = new ResGen("/Users/small/WebstormProjects/Dev/mg/", "res", "src", "test", "cfg/Res.js");
		gen.gen();
	}

	//res, appJs, testJs

	private List<String> resList = new ArrayList<String>();
	private String baseDir = "";
	private String resDir = "";
	private String jsDir = "";
	private String testJsDir = "";
	private String outputPath = "";

	static List<String> fileTypeList = new ArrayList<String>();

	static {
		fileTypeList.add("png");
		fileTypeList.add("jpg");
		fileTypeList.add("bmp");
		fileTypeList.add("jpeg");
		fileTypeList.add("gif");
		fileTypeList.add("mp3");
		fileTypeList.add("ogg");
		fileTypeList.add("wav");
		fileTypeList.add("mp4");
		fileTypeList.add("plist");
		fileTypeList.add("xml");
		fileTypeList.add("fnt");
		fileTypeList.add("tmx");
		fileTypeList.add("tsx");
		fileTypeList.add("ccbi");
		fileTypeList.add("font");
		fileTypeList.add("txt");
		fileTypeList.add("vsh");
		fileTypeList.add("fsh");
		fileTypeList.add("json");
		fileTypeList.add("js");
	}

	public ResGen(String baseDir, String resDir, String jsDir, String testJsDir, String outputPath){
		this.baseDir = baseDir;
		this.resDir = resDir;
		this.jsDir = jsDir;
		this.testJsDir = testJsDir;
		this.outputPath = outputPath;
	}

	public void parse(File file){
		if(file == null || file.isFile()) return;
		File[] files = file.listFiles();
		for(int i = 0; i < files.length; ++i){
			if(files[i].isDirectory()){
				this.parse(files[i]);
			}else if(files[i].isFile()){
				String name = files[i].getName();
				int index = name.lastIndexOf(".");
				if(index <= 0) continue;
				String fileType = name.substring(index + 1).toLowerCase();
				if(fileTypeList.indexOf(fileType) < 0) continue;
				String path = files[i].getPath();
				path = path.substring(baseDir.length());
				path = path.replaceAll("\\\\", "/");
				resList.add(path);
			}
		}
	}
	private String getKeyName(String name, String keyPre){
		int index = name.lastIndexOf("/");
		index = index < 0 ? 0 : index;
		String fileName = name.substring(index + 1);
		fileName = fileName.replaceAll("\\.", "_");
		fileName = fileName.replaceAll("-", "_");
		return keyPre == null ? fileName : keyPre + fileName;
	}

	public void gen(){
		parse(new File(baseDir + resDir));
		parse(new File(baseDir + jsDir));
		parse(new File(baseDir + testJsDir));

		FileOutputStream out = null;
		try{
            out=new FileOutputStream(this.baseDir + this.outputPath);
            PrintStream ps=new PrintStream(out);
            ps.println("Res = {");
    		for(int i = 0; i < resList.size(); ++i){
    			StringBuffer sb = new StringBuffer();
    			sb.append("    ").append(this.getKeyName(resList.get(i), null)).append(" : '").append(resList.get(i)).append("'");
    			if(i < resList.size() - 1) sb.append(",");
    			ps.println(sb);
    		}
    		ps.println("};");
    		ps.close();
        } catch (FileNotFoundException e){
            e.printStackTrace();
        } finally{
    		if(out != null)
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
        }
	};

}
